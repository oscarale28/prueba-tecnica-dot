import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { EtapaResponseDTO } from '../../models/proyecto.models';
import { EtapasTimelineComponent } from '../etapas-timeline/etapas-timeline.component';

@Component({
    selector: 'app-etapas-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule, EtapasTimelineComponent],
    templateUrl: './etapas-dialog.component.html'
})
export class EtapasDialogComponent {
    @Input() visible = false;
    @Input() loading = false;
    @Input() etapas: EtapaResponseDTO[] = [];
    @Input() proyectoNombre: string | null = null;
    @Output() closed = new EventEmitter<void>();
}
