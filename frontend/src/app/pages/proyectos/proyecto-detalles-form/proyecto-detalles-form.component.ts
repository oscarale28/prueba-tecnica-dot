import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ESTADO_PROYECTO_OPTIONS, ProyectoResponseDTO, ProyectoUpdateDTO, EstadoProyectoEnum } from '../../models/proyecto.models';
import { Select } from "primeng/select";
import { TextareaModule } from 'primeng/textarea';
import { ProyectoService } from '../../service/proyecto.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FieldError } from "./field-error/field-error";
type ProyectoField = keyof Pick<
    ProyectoResponseDTO,
    'nombre' | 'descripcion' | 'estado' | 'fechaInicio' | 'fechaFin'
>;

@Component({
    selector: 'app-proyecto-detalles-form',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, TextareaModule, FieldError],
    templateUrl: './proyecto-detalles-form.component.html',
    styleUrls: ['./proyecto-detalles-form.component.css']
})
export class ProyectoDetallesFormComponent {
    readonly proyectoService = inject(ProyectoService);
    readonly estadoOptions = ESTADO_PROYECTO_OPTIONS;
    readonly messageService = inject(MessageService);
    readonly confirmService = inject(ConfirmationService);
    readonly formErrors = computed(() => {
        const draft = this.proyectoService.draft();
        if (!draft) {
            return {
                nombre: '',
                descripcion: '',
                estado: '',
                fechaInicio: '',
                fechaFin: '',
                dateOrder: ''
            };
        }

        const nombre = draft.nombre?.trim() ?? '';
        const descripcion = draft.descripcion?.trim() ?? '';
        const fechaInicio = draft.fechaInicio ?? '';
        const fechaFin = draft.fechaFin ?? '';
        const errors = {
            nombre: '',
            descripcion: '',
            estado: '',
            fechaInicio: '',
            fechaFin: '',
            dateOrder: ''
        };

        if (!nombre) {
            errors.nombre = 'El nombre es obligatorio.';
        } else if (nombre.length > 150) {
            errors.nombre = 'El nombre no puede exceder 150 caracteres.';
        }

        if (descripcion.length > 500) {
            errors.descripcion = 'La descripción no puede exceder 500 caracteres.';
        }

        if (!draft.estado) {
            errors.estado = 'El estado es obligatorio.';
        }

        if (!fechaInicio) {
            errors.fechaInicio = 'La fecha de inicio es obligatoria.';
        }

        if (fechaFin && fechaInicio && fechaFin < fechaInicio) {
            errors.dateOrder = 'La fecha fin no puede ser anterior a la fecha inicio.';
        }

        return errors;
    });

    readonly proyectoPausado = computed(() => this.proyectoService.proyectoPausado());
    readonly isFormValid = computed(() => {
        const errors = this.formErrors();
        return !errors.nombre && !errors.descripcion && !errors.estado && !errors.fechaInicio && !errors.dateOrder;
    });

    readonly hasChanges = computed(() => {
        const changed = this.proyectoService.changedFields();
        return (
            changed.nombre ||
            changed.descripcion ||
            changed.estado ||
            changed.fechaInicio ||
            changed.fechaFin
        );
    });

    onFieldChange(field: ProyectoField, value: ProyectoResponseDTO[ProyectoField]) {
        this.proyectoService.updateFormField(field, value);
    }

    onSave() {
        if (!this.hasChanges()) {
            this.messageService.add({
                severity: 'info',
                summary: 'Sin cambios',
                detail: 'No se han realizado cambios al proyecto',
                life: 3000
            });
            return;
        }
        if (!this.isFormValid()) {
            return;
        }

        const draft = this.proyectoService.draft();
        if (!draft) {
            return;
        }

        if (draft.estado === EstadoProyectoEnum.PAUSADO) {
            this.confirmService.confirm({
                message: 'Está a punto de pausar el proyecto seleccionado. Esto no permitirá modificar el proyecto ni sus etapas hasta que sea reanudado. ¿Está seguro de querer continuar?',
                header: 'Pausar proyecto',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí, pausar',
                rejectLabel: 'No, cancelar',
                acceptButtonStyleClass: 'p-button-primary',
                rejectButtonStyleClass: 'p-button-secondary',
                accept: () => {
                    this.prepareOnSave(draft);
                },
                reject: () => {
                    return;
                }
            });
            return;
        }

        this.prepareOnSave(draft);
    }

    prepareOnSave(draft: ProyectoResponseDTO) {
        const payload: ProyectoUpdateDTO = {
            nombre: draft.nombre.trim(),
            descripcion: draft.descripcion?.trim() ?? '',
            fechaInicio: draft.fechaInicio,
            fechaFin: draft.fechaFin ? draft.fechaFin : null,
            estado: draft.estado
        };

        this.proyectoService.saveProyecto(payload);
    }

}
