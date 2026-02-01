import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, inject } from '@angular/core';
import { ProyectoPanel } from '../../models/proyecto.models';
import { ProyectoService } from '../../service/proyecto.service';

@Component({
    selector: 'app-proyecto-side-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './proyecto-side-panel.component.html',
    styleUrls: ['./proyecto-side-panel.component.css'],
    host: {
        class: 'proyectos-side-panel',
        '[class.is-open]': 'proyectoService.sidePanelOpen()'
    }
})
export class ProyectoSidePanelComponent {
    @Input() etapasTemplate: TemplateRef<unknown> | null = null;
    @Input() formTemplate: TemplateRef<unknown> | null = null;

    readonly proyectoService = inject(ProyectoService);
    readonly Panel = ProyectoPanel;
}
