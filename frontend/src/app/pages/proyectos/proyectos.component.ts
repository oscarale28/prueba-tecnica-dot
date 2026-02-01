import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProyectoListResponseDTO } from '../models/proyecto.models';
import { ProyectoService } from '../service/proyecto.service';
import { EtapaService } from '../service/etapa.service';
import { ProyectoSyncService } from '../service/proyecto-sync.service';
import { ProyectosTableComponent } from "./proyectos-table/proyectos-table.component";
import { EtapasTimelineComponent } from './etapas-timeline/etapas-timeline.component';
import { ProyectoDialogComponent } from './proyecto-dialog/proyecto-dialog.component';
import { ProyectoDetallesFormComponent } from './proyecto-detalles-form/proyecto-detalles-form.component';
import { ProyectoSidePanelComponent } from './proyecto-side-panel/proyecto-side-panel.component';
import { Toast } from "primeng/toast";
import { ConfirmDialog } from 'primeng/confirmdialog';
@Component({
    selector: 'app-proyectos',
    standalone: true,
    imports: [
        CommonModule,
        ProyectosTableComponent,
        EtapasTimelineComponent,
        ProyectoDialogComponent,
        ProyectoDetallesFormComponent,
        ProyectoSidePanelComponent,
        Toast,
        ConfirmDialog
    ],
    templateUrl: 'proyectos.component.html',
    styleUrls: ['proyectos.component.css'],
    providers: [MessageService, ConfirmationService, ProyectoService, EtapaService, ProyectoSyncService]
})
export class ProyectosComponent {
    readonly proyectoService = inject(ProyectoService);

    readonly proyectos = this.proyectoService.proyectos;
    readonly loading = this.proyectoService.loading;
    readonly totalRecords = this.proyectoService.totalRecords;
    readonly first = this.proyectoService.first;
    readonly rows = this.proyectoService.rows;

    onPageChange(event: { first: number; rows: number }) {
        this.proyectoService.onPageChange(event.first, event.rows);
    }

    onEtapasClick(proyecto: ProyectoListResponseDTO) {
        this.proyectoService.openEtapasDialog(proyecto);
    }

    onEditClick(proyecto: ProyectoListResponseDTO) {
        this.proyectoService.openEditDialog(proyecto);
    }
}
