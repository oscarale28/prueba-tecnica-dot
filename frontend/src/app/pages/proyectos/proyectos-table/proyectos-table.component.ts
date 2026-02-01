import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ProyectoListResponseDTO } from '../../models/proyecto.models';
import { ProyectoService } from '../../service/proyecto.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'app-proyectos-table',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ChartModule,
        ButtonModule,
        RippleModule,
        ToolbarModule,
        InputTextModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        TooltipModule
    ],
    templateUrl: './proyectos-table.component.html'
})
export class ProyectosTableComponent {
    @Input() proyectos: ProyectoListResponseDTO[] = [];
    @Input() loading = false;
    @Input() totalRecords = 0;
    @Input() first = 0;
    @Input() rows = 10;

    @Output() pageChange = new EventEmitter<{ first: number; rows: number }>();
    @Output() etapasClick = new EventEmitter<ProyectoListResponseDTO>();

    @ViewChild('dt') dt!: Table;

    constructor(public proyectoService: ProyectoService) { }

    readonly cols: Column[] = [
        { field: 'idProyecto', header: 'ID', customExportHeader: 'ID Proyecto' },
        { field: 'nombre', header: 'Nombre' },
        { field: 'descripcion', header: 'Descripción' },
        { field: 'estado', header: 'Estado' },
        { field: 'fechaInicio', header: 'Fecha Inicio' },
        { field: 'fechaFin', header: 'Fecha Fin' },
        { field: 'resumenEtapas', header: 'Etapas' }
    ];

    onPageChange(event: any) {
        this.pageChange.emit({ first: event.first, rows: event.rows });
    }

    onEtapasClick(proyecto: ProyectoListResponseDTO) {
        this.etapasClick.emit(proyecto);
    }
}
