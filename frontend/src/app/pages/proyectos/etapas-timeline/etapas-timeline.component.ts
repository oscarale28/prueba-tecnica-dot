import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { ProyectoService } from '../../service/proyecto.service';

@Component({
    selector: 'app-etapas-timeline',
    standalone: true,
    imports: [CommonModule, TimelineModule, TagModule],
    templateUrl: './etapas-timeline.component.html',
    styleUrls: ['./etapas-timeline.component.css']
})
export class EtapasTimelineComponent {
    readonly proyectoService = inject(ProyectoService);
}
