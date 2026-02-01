import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { EtapaResponseDTO, EtapaUpdateDTO } from '@/pages/models/proyecto.models';
import { EtapaService } from '@/pages/service/etapa.service';
import { FieldError } from '../../proyecto-detalles-form/field-error/field-error';

type EtapaField = keyof Pick<
    EtapaUpdateDTO,
    'nombre' | 'fechaInicio' | 'fechaFinEstimada' | 'presupuestoAsignado'
>;

interface EtapaFormErrors {
    nombre: string;
    fechaInicio: string;
    fechaFinEstimada: string;
    presupuestoAsignado: string;
    dateOrder: string;
}

@Component({
    selector: 'app-etapa-detalles-form',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, InputNumber, FieldError],
    templateUrl: './etapa-detalles-form.component.html',
    styleUrls: ['./etapa-detalles-form.component.css']
})
export class EtapaDetallesFormComponent {
    @Input({ required: true }) etapa!: EtapaResponseDTO;

    readonly etapaService = inject(EtapaService);

    readonly formErrors = computed<EtapaFormErrors>(() => {
        if (!this.etapaService.isEditing(this.etapa.idEtapa)) {
            return this.emptyErrors();
        }
        const draft = this.etapaService.editDraft();
        if (!draft) {
            return this.emptyErrors();
        }

        const nombre = draft.nombre?.trim() ?? '';
        const errors: EtapaFormErrors = {
            nombre: '',
            fechaInicio: '',
            fechaFinEstimada: '',
            presupuestoAsignado: '',
            dateOrder: ''
        };

        if (!nombre) {
            errors.nombre = 'El nombre es obligatorio.';
        } else if (nombre.length > 150) {
            errors.nombre = 'El nombre no puede exceder 150 caracteres.';
        }

        if (!draft.fechaInicio) {
            errors.fechaInicio = 'La fecha de inicio es obligatoria.';
        }

        if (!draft.fechaFinEstimada) {
            errors.fechaFinEstimada = 'La fecha de fin estimada es obligatoria.';
        }

        if (draft.fechaInicio && draft.fechaFinEstimada && draft.fechaFinEstimada < draft.fechaInicio) {
            errors.dateOrder = 'La fecha fin no puede ser anterior a la fecha inicio.';
        }

        if (draft.presupuestoAsignado === null || draft.presupuestoAsignado === undefined || draft.presupuestoAsignado <= 0) {
            errors.presupuestoAsignado = 'El presupuesto debe ser mayor a 0.';
        }

        return errors;
    });

    readonly isFormValid = computed(() => {
        const errors = this.formErrors();
        return (
            !errors.nombre &&
            !errors.fechaInicio &&
            !errors.fechaFinEstimada &&
            !errors.presupuestoAsignado &&
            !errors.dateOrder
        );
    });

    onFieldChange(field: EtapaField, value: EtapaUpdateDTO[EtapaField]) {
        this.etapaService.updateDraftField(field, value);
    }

    coerceNumber(value: string | number) {
        const parsed = typeof value === 'number' ? value : Number(value);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    onSave() {
        if (!this.etapaService.isEditing(this.etapa.idEtapa)) {
            return;
        }
        if (!this.isFormValid()) {
            return;
        }
        this.etapaService.saveEdit(this.etapa.idEtapa);
    }

    isFieldChanged(field: EtapaField) {
        const changed = this.etapaService.changedFields();
        return this.etapaService.isEditing(this.etapa.idEtapa) && changed[field];
    }

    private emptyErrors(): EtapaFormErrors {
        return {
            nombre: '',
            fechaInicio: '',
            fechaFinEstimada: '',
            presupuestoAsignado: '',
            dateOrder: ''
        };
    }
}
