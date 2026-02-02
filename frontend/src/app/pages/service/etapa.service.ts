import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, effect, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { forkJoin, of } from 'rxjs';
import { EtapaCreateDTO, EtapaResponseDTO, EtapaUpdateDTO, EstadoEtapaEnum, EstadoProyectoEnum } from '../models/proyecto.models';
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
    readonly isCreateMode = computed(() => this.proyectoService.isCreateMode());
    readonly draftEtapas = signal<EtapaResponseDTO[]>([]);
    readonly timelineEtapas = computed(() => (this.isCreateMode() ? this.draftEtapas() : this.etapas()));

    readonly editingId = signal<number | null>(null);
    readonly editOriginal = signal<EtapaUpdateDTO | null>(null);
    readonly editDraft = signal<EtapaUpdateDTO | null>(null);
    readonly saving = signal<boolean>(false);
    readonly creatingDrafts = signal<boolean>(false);
    private nextDraftId = signal<number>(-1);
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
    ) {
        effect(
            () => {
                const isCreateMode = this.isCreateMode();
                if (isCreateMode) {
                    this.resetDrafts();
                } else {
                    this.resetDrafts();
                }
            },
            { allowSignalWrites: true }
        );

        effect(
            () => {
                const proyectoId = this.proyectoService.createdProyectoId();
                if (!proyectoId || this.creatingDrafts()) {
                    return;
                }
                const drafts = this.draftEtapas();
                if (!drafts.length) {
                    this.proyectoService.finalizeCreateFlow();
                    this.proyectoService.clearCreatedProyectoId();
                    return;
                }
                this.persistDraftEtapas(proyectoId, drafts);
            },
            { allowSignalWrites: true }
        );
    }

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
        if (this.isCreateMode() && idEtapa < 0) {
            this.updateDraftEtapa(idEtapa, draft);
            return;
        }
        this.persistUpdate(idEtapa, draft);
    }

    canStartEtapa(etapa: EtapaResponseDTO) {
        return !this.isCreateMode() && etapa.estado === EstadoEtapaEnum.PENDIENTE && !this.proyectoService.proyectoPausado();
    }

    canCompleteEtapa(etapa: EtapaResponseDTO) {
        return !this.isCreateMode() && etapa.estado === EstadoEtapaEnum.EN_PROGRESO && !this.proyectoService.proyectoPausado();
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

    addDraftEtapa() {
        if (!this.isCreateMode()) {
            return;
        }
        const draftProyecto = this.proyectoService.draft();
        const idEtapa = this.consumeDraftId();
        const orden = this.draftEtapas().length + 1;
        const etapa: EtapaResponseDTO = {
            idEtapa,
            nombre: '',
            orden,
            fechaInicio: '',
            fechaFinEstimada: '',
            presupuestoAsignado: 0,
            estado: EstadoEtapaEnum.PENDIENTE,
            proyecto: {
                idProyecto: draftProyecto?.idProyecto ?? 0,
                nombre: draftProyecto?.nombre ?? '',
                descripcion: draftProyecto?.descripcion ?? '',
                fechaInicio: draftProyecto?.fechaInicio ?? '',
                fechaFin: draftProyecto?.fechaFin ?? '',
                estado: draftProyecto?.estado ?? EstadoProyectoEnum.PLANIFICADO
            }
        };
        this.draftEtapas.update((prev) => [...prev, etapa]);
        this.startEdit(etapa);
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

    private updateDraftEtapa(idEtapa: number, payload: EtapaUpdateDTO) {
        this.draftEtapas.update((prev) =>
            prev.map((etapa) => (etapa.idEtapa === idEtapa ? { ...etapa, ...payload } : etapa))
        );
        this.cancelEdit();
    }

    private persistDraftEtapas(proyectoId: number, drafts: EtapaResponseDTO[]) {
        this.creatingDrafts.set(true);
        const requests = drafts.map((draft) => this.createEtapa(this.buildCreatePayload(draft, proyectoId)));
        forkJoin(requests.length ? requests : [of(null)]).subscribe({
            next: () => {
                this.proyectoSync.refreshAfterEtapaUpdate();
                this.resetDrafts();
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error creating etapas:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Ocurrió un error al crear las etapas.',
                    life: 5000
                });
                this.creatingDrafts.set(false);
                this.proyectoService.finalizeCreateFlow();
                this.proyectoService.clearCreatedProyectoId();
            },
            complete: () => {
                this.creatingDrafts.set(false);
                this.proyectoService.finalizeCreateFlow();
                this.proyectoService.clearCreatedProyectoId();
            }
        });
    }

    private createEtapa(payload: EtapaCreateDTO) {
        return this.http.post<EtapaResponseDTO>(this.apiUrl, payload);
    }

    private buildCreatePayload(etapa: EtapaResponseDTO, proyectoId: number): EtapaCreateDTO {
        return {
            nombre: etapa.nombre,
            orden: etapa.orden,
            fechaInicio: etapa.fechaInicio,
            fechaFinEstimada: etapa.fechaFinEstimada,
            presupuestoAsignado: etapa.presupuestoAsignado,
            estado: etapa.estado,
            proyectoId
        };
    }

    private resetDrafts() {
        this.draftEtapas.set([]);
        this.nextDraftId.set(-1);
        this.cancelEdit();
    }

    private consumeDraftId() {
        const current = this.nextDraftId();
        this.nextDraftId.set(current - 1);
        return current;
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
