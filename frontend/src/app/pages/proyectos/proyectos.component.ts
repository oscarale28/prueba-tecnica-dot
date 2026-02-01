import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ProyectoListResponseDTO } from '../models/proyecto.models';
import { ProyectoService } from '../service/proyecto.service';
import { ProyectosTableComponent } from "./proyectos-table/proyectos-table.component";
import { EtapasDialogComponent } from './etapas-dialog/etapas-dialog.component';

@Component({
    selector: 'app-proyectos',
    standalone: true,
    imports: [
        CommonModule,
        ProyectosTableComponent,
        EtapasDialogComponent
    ],
    templateUrl: 'proyectos.component.html',
    styleUrls: ['proyectos.component.css'],
    providers: [MessageService, ProyectoService]
})
export class ProyectosComponent implements OnInit {
    readonly proyectoService = inject(ProyectoService);
    readonly proyectos = this.proyectoService.proyectos;
    readonly loading = this.proyectoService.loading;
    readonly totalRecords = this.proyectoService.totalRecords;
    readonly first = this.proyectoService.first;
    readonly rows = this.proyectoService.rows;

    ngOnInit() {
        this.proyectoService.init();
    }

    onPageChange(event: { first: number; rows: number }) {
        this.proyectoService.onPageChange(event.first, event.rows);
    }

    onEtapasClick(proyecto: ProyectoListResponseDTO) {
        this.proyectoService.openEtapasDialog(proyecto);
    }
}
