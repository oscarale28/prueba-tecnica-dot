import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { EtapaResponseDTO, EtapaUpdateDTO, EstadoEtapaEnum } from '../models/proyecto.models';
import { ProyectoService } from './proyecto.service';
import { ProyectoSyncService } from './proyecto-sync.service';

type EtapaField = keyof Pick<
    EtapaUpdateDTO,
    'nombre' | 'fechaInicio' | 'fechaFinEstimada' | 'presupuestoAsignado'
>;

@Injectable()
export class EtapaService {
    private apiUrl = `${environment.apiBaseUrl}/etapas`;

    readonly etapas = computed(() => this.proyectoService.etapas());
    readonly etapasLoading = computed(() => this.proyectoService.etapasLoading());

    readonly editingId = signal<number | null>(null);
    readonly editOriginal = signal<EtapaUpdateDTO | null>(null);
    readonly editDraft = signal<EtapaUpdateDTO | null>(null);
    readonly saving = signal<boolean>(false);
    readonly changedFields = computed(() => {
        const original = this.editOriginal();
        const draft = this.editDraft();
        if (!original || !draft) {
            return {
                nombre: false,
                fechaInicio: false,
                fechaFinEstimada: false,
                presupuestoAsignado: false
            };
        }

        return {
            nombre: draft.nombre !== original.nombre,
            fechaInicio: draft.fechaInicio !== original.fechaInicio,
            fechaFinEstimada: draft.fechaFinEstimada !== original.fechaFinEstimada,
            presupuestoAsignado: draft.presupuestoAsignado !== original.presupuestoAsignado
        };
    });

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private proyectoService: ProyectoService,
        private proyectoSync: ProyectoSyncService
    ) { }

    startEdit(etapa: EtapaResponseDTO) {
        if (this.proyectoService.proyectoPausado()) {
            return;
        }
        const base = this.buildDraftFromEtapa(etapa);
        this.editingId.set(etapa.idEtapa);
        this.editOriginal.set(base);
        this.editDraft.set({ ...base });
    }

    cancelEdit() {
        this.editingId.set(null);
        this.editOriginal.set(null);
        this.editDraft.set(null);
    }

    isEditing(idEtapa: number) {
        return this.editingId() === idEtapa;
    }

    updateDraftField(field: EtapaField, value: EtapaUpdateDTO[EtapaField]) {
        this.editDraft.update((draft) => (draft ? { ...draft, [field]: value } : draft));
    }

    saveEdit(idEtapa: number) {
        const draft = this.editDraft();
        if (!draft) {
            return;
        }
        this.persistUpdate(idEtapa, draft);
    }

    canStartEtapa(etapa: EtapaResponseDTO) {
        return etapa.estado === EstadoEtapaEnum.PENDIENTE && !this.proyectoService.proyectoPausado();
    }

    canCompleteEtapa(etapa: EtapaResponseDTO) {
        return etapa.estado === EstadoEtapaEnum.EN_PROGRESO && !this.proyectoService.proyectoPausado();
    }

    startEtapa(etapa: EtapaResponseDTO) {
        if (!this.canStartEtapa(etapa)) {
            return;
        }
        this.persistEstadoUpdate(etapa.idEtapa);
    }

    completeEtapa(etapa: EtapaResponseDTO) {
        if (!this.canCompleteEtapa(etapa)) {
            return;
        }
        this.persistEstadoUpdate(etapa.idEtapa);
    }

    private buildDraftFromEtapa(etapa: EtapaResponseDTO): EtapaUpdateDTO {
        return {
            nombre: etapa.nombre,
            orden: etapa.orden,
            fechaInicio: etapa.fechaInicio,
            fechaFinEstimada: etapa.fechaFinEstimada,
            presupuestoAsignado: etapa.presupuestoAsignado
        };
    }

    private persistUpdate(idEtapa: number, payload: EtapaUpdateDTO) {
        this.saving.set(true);
        this.http.put<EtapaResponseDTO>(`${this.apiUrl}/${idEtapa}`, payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Etapa actualizada correctamente',
                    life: 3000
                });
                this.proyectoSync.refreshAfterEtapaUpdate();
                this.cancelEdit();
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error updating etapa:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Ocurrió un error al actualizar la etapa.',
                    life: 5000
                });
                this.saving.set(false);
            },
            complete: () => {
                this.saving.set(false);
            }
        });
    }

    private persistEstadoUpdate(idEtapa: number) {
        this.saving.set(true);
        this.http.patch<EtapaResponseDTO>(`${this.apiUrl}/${idEtapa}/estado`, null).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Estado de etapa actualizado correctamente',
                    life: 3000
                });
                this.proyectoSync.refreshAfterEtapaUpdate();
                this.cancelEdit();
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error updating etapa estado:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Ocurrió un error al actualizar el estado de la etapa.',
                    life: 5000
                });
                this.saving.set(false);
            },
            complete: () => {
                this.saving.set(false);
            }
        });
    }
}
