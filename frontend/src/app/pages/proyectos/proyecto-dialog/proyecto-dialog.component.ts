import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-proyecto-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule],
    templateUrl: './proyecto-dialog.component.html'
})
export class ProyectoDialogComponent {
    @Input() visible = false;
    @Input() title = '';
    @Input() subtitle = '';
    @Input() loading = false;
    @Input() bodyTemplate: TemplateRef<unknown> | null = null;

    @Output() closed = new EventEmitter<void>();
}
