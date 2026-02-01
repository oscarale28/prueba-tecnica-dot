import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { ProyectoService } from '../../service/proyecto.service';
import { EtapaService } from '../../service/etapa.service';
import { EstadoEtapaEnum, EtapaResponseDTO } from '@/pages/models/proyecto.models';
import { EtapaDetallesFormComponent } from './etapa-detalles-form/etapa-detalles-form.component';
import { Tooltip } from "primeng/tooltip";

@Component({
    selector: 'app-etapas-timeline',
    standalone: true,
    imports: [CommonModule, TimelineModule, TagModule, ButtonModule, EtapaDetallesFormComponent, Tooltip],
    templateUrl: './etapas-timeline.component.html',
    styleUrls: ['./etapas-timeline.component.css']
})
export class EtapasTimelineComponent {
    readonly proyectoService = inject(ProyectoService);
    readonly etapaService = inject(EtapaService);

    isEditable(etapa: EtapaResponseDTO): boolean {
        return etapa.estado === EstadoEtapaEnum.PENDIENTE;
    }
}
