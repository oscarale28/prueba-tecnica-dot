import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { EtapaResponseDTO } from '../../models/proyecto.models';
import { ProyectoService } from '../../service/proyecto.service';

@Component({
    selector: 'app-etapas-timeline',
    standalone: true,
    imports: [CommonModule, TimelineModule, TagModule],
    templateUrl: './etapas-timeline.component.html'
})
export class EtapasTimelineComponent {
    @Input() etapas: EtapaResponseDTO[] = [];

    constructor(public proyectoService: ProyectoService) { }
}
