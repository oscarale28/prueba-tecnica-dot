import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ChartData, ChartOptions } from 'chart.js';
import { environment } from '../../../environments/environment';
import {
    EstadoEtapaEnum,
    EstadoProyectoEnum,
    EtapaResponseDTO,
    PaginatedResponse,
    ProyectoPanel,
    ProyectoCreateDTO,
    ProyectoDetailResponseDTO,
    ProyectoListResponseDTO,
    ProyectoResponseDTO,
    ProyectoUpdateDTO
} from '../models/proyecto.models';

@Injectable()
export class ProyectoService {
    private apiUrl = `${environment.apiBaseUrl}/proyectos`;
    private etapasUrl = `${environment.apiBaseUrl}/etapas/proyecto`;
    private readonly etapaStatusColors = {
        COMPLETADA: '#8AFF9B',
        EN_PROGRESO: '#3b82f6',
        PENDIENTE: '#F2F2F2'
    } as const;

    readonly proyectos = signal<ProyectoListResponseDTO[]>([]);
    readonly loading = signal<boolean>(false);
    readonly totalRecords = signal<number>(0);
    readonly first = signal<number>(0);
    readonly rows = signal<number>(10);

    readonly selectedProyecto = signal<ProyectoListResponseDTO | null>(null);
    readonly selectedProyectoId = computed(() => this.selectedProyecto()?.idProyecto ?? null);
    readonly proyectoPausado = computed(() => this.selectedProyecto()?.estado === EstadoProyectoEnum.PAUSADO);

    readonly etapas = signal<EtapaResponseDTO[]>([]);
    readonly etapasLoading = signal<boolean>(false);
    readonly etapasDialogOpen = signal<boolean>(false);

    readonly formDialogOpen = signal<boolean>(false);
    readonly activePanel = signal<ProyectoPanel | null>(null);
    readonly isDesktop = signal<boolean>(false);
    readonly formMode = signal<'create' | 'edit' | null>(null);
    readonly formSubmitted = signal<boolean>(false);
    readonly createdProyectoId = signal<number | null>(null);

    readonly formLoading = signal<boolean>(false);
    readonly formOriginal = signal<ProyectoResponseDTO | null>(null);
    readonly draft = signal<ProyectoResponseDTO | null>(null);
    readonly isCreateMode = computed(() => this.formMode() === 'create');
    readonly shouldValidateForm = computed(() => !this.isCreateMode() || this.formSubmitted());
    readonly changedFields = computed(() => {
        const original = this.formOriginal();
        const editable = this.draft();
        if (!original || !editable) {
            return {
                nombre: false,
                descripcion: false,
                estado: false,
                fechaInicio: false,
                fechaFin: false
            };
        }

        return {
            nombre: editable.nombre !== original.nombre,
            descripcion: editable.descripcion !== original.descripcion,
            estado: editable.estado !== original.estado,
            fechaInicio: editable.fechaInicio !== original.fechaInicio,
            fechaFin: editable.fechaFin !== original.fechaFin
        };
    });
    readonly sidePanelOpen = computed(() => this.isDesktop() && this.activePanel() !== null);

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        if (typeof window !== 'undefined') {
            const media = window.matchMedia('(min-width: 992px)');
            this.isDesktop.set(media.matches);
            const handler = (event: MediaQueryListEvent) => this.isDesktop.set(event.matches);
            if (media.addEventListener) {
                media.addEventListener('change', handler);
            } else {
                media.addListener(handler);
            }
        }
    }

    init() {
        this.loadProyectos(1, this.rows());
    }

    /** ---- HTTP REQUESTS ---- */
    getProyectos(page: number = 1, size: number = 10): Observable<PaginatedResponse<ProyectoListResponseDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<ProyectoListResponseDTO>>(this.apiUrl, { params });
    }

    getProyectoById(id: number): Observable<ProyectoDetailResponseDTO> {
        return this.http.get<ProyectoDetailResponseDTO>(`${this.apiUrl}/${id}`);
    }

    getEtapasByProyecto(idProyecto: number): Observable<EtapaResponseDTO[]> {
        return this.http.get<EtapaResponseDTO[]>(`${this.etapasUrl}/${idProyecto}`);
    }

    createProyecto(payload: ProyectoCreateDTO): Observable<ProyectoResponseDTO> {
        return this.http.post<ProyectoResponseDTO>(this.apiUrl, payload);
    }

    updateProyecto(idProyecto: number, payload: ProyectoUpdateDTO): Observable<ProyectoResponseDTO | null> {
        return this.http.put<ProyectoResponseDTO | null>(`${this.apiUrl}/${idProyecto}`, payload);
    }

    // Consulta paginada de proyectos
    loadProyectos(page?: number, size?: number) {

        if (page === undefined || size === undefined) {
            page = Math.floor(this.first() / this.rows()) + 1;
            size = this.rows();
        }

        this.loading.set(true);
        this.getProyectos(page, size).subscribe({
            next: (response) => {
                this.proyectos.set(response.data);
                this.totalRecords.set(response.totalElements);
            },
            error: (error) => {
                console.error('Error loading proyectos:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error al cargar los proyectos.',
                    life: 5000
                });
                this.loading.set(false);
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

    // Cambio de página en la tabla de proyectos
    onPageChange(first: number, rows: number) {
        const page = Math.floor(first / rows) + 1;
        this.first.set(first);
        this.rows.set(rows);
        this.loadProyectos(page, rows);
    }

    // Apertura del diálogo de etapas
    openEtapasDialog(proyecto: ProyectoListResponseDTO) {
        this.formDialogOpen.set(false);
        this.resetFormState();
        this.selectedProyecto.set(proyecto);
        this.etapas.set([]);
        this.loadEtapas(proyecto.idProyecto);
        if (this.isDesktop()) {
            this.activePanel.set(ProyectoPanel.Etapas);
        } else {
            this.etapasDialogOpen.set(true);
        }
    }

    // Cierre del diálogo de etapas
    closeEtapasDialog() {
        this.etapasDialogOpen.set(false);
        if (this.activePanel() === ProyectoPanel.Etapas) {
            this.activePanel.set(null);
        }
        this.selectedProyecto.set(null);
        this.etapas.set([]);
    }

    // Apertura del formulario de edición
    openEditDialog(proyecto: ProyectoListResponseDTO) {
        this.etapasDialogOpen.set(false);
        if (this.activePanel() === ProyectoPanel.Etapas) {
            this.activePanel.set(null);
        }
        this.formDialogOpen.set(false);
        this.resetFormState();
        this.formMode.set('edit');
        this.selectedProyecto.set(proyecto);
        this.formLoading.set(true);

        if (this.isDesktop()) {
            this.activePanel.set(ProyectoPanel.EditarProyecto);
        } else {
            this.formDialogOpen.set(true);
        }

        this.getProyectoById(proyecto.idProyecto).subscribe({
            next: (response) => {
                const base: ProyectoResponseDTO = {
                    idProyecto: response.idProyecto,
                    nombre: response.nombre,
                    descripcion: response.descripcion,
                    fechaInicio: response.fechaInicio,
                    fechaFin: response.fechaFin,
                    estado: response.estado
                };
                this.formOriginal.set(base);
                this.draft.set({ ...base });
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error loading proyecto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message || 'Ocurrió un error al cargar el proyecto.',
                    life: 5000
                });
                this.formLoading.set(false);
            },
            complete: () => {
                this.formLoading.set(false);
            }
        });
    }

    openNewProjectDialog() {
        this.formDialogOpen.set(false);
        this.resetFormState();
        this.formMode.set('create');
        this.formSubmitted.set(false);
        this.draft.set({
            idProyecto: 0,
            nombre: '',
            descripcion: '',
            fechaInicio: '',
            fechaFin: '',
            estado: EstadoProyectoEnum.PLANIFICADO
        } as ProyectoResponseDTO);
        this.selectedProyecto.set(null);
        this.etapas.set([]);
        this.formLoading.set(false);
        if (this.isDesktop()) {
            this.activePanel.set(ProyectoPanel.NuevoProyecto);
        } else {
            this.formDialogOpen.set(true);
        }
    }

    closeFormDialog() {
        this.formDialogOpen.set(false);
        this.activePanel.set(null);
        this.resetFormState();
    }

    closeSidePanel() {
        if (this.activePanel() === ProyectoPanel.Etapas) {
            this.etapas.set([]);
        }
        this.selectedProyecto.set(null);
        this.activePanel.set(null);
        this.resetFormState();
    }

    updateFormField<K extends keyof ProyectoResponseDTO>(field: K, value: ProyectoResponseDTO[K]) {
        this.draft.update((prev) => (prev ? { ...prev, [field]: value } : prev));
    }

    markFormSubmitted() {
        this.formSubmitted.set(true);
    }

    saveProyecto(payload: ProyectoUpdateDTO) {
        const editable = this.draft();
        if (!editable) {
            return;
        }

        this.formLoading.set(true);
        if (this.isCreateMode()) {
            this.createProyecto(payload).subscribe({
                next: (response) => {
                    this.loadProyectos();
                    this.createdProyectoId.set(response.idProyecto);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Proyecto creado correctamente',
                        life: 3000
                    });
                },
                error: (error: HttpErrorResponse) => {
                    console.error('Error creating proyecto:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Ocurrió un error al crear el proyecto.',
                        life: 5000
                    });
                    this.formLoading.set(false);
                },
                complete: () => {
                    this.formLoading.set(false);
                }
            });
            return;
        }
        this.updateProyecto(editable.idProyecto, payload).subscribe({
            next: () => {
                this.loadProyectos();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Proyecto actualizado correctamente',
                    life: 3000
                });
                this.closeFormDialog();
                this.closeSidePanel();
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error updating proyecto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message || 'Ocurrió un error al actualizar el proyecto.',
                    life: 5000
                });
                this.formLoading.set(false);
            },
            complete: () => {
                this.formLoading.set(false);
            }
        });
    }

    finalizeCreateFlow() {
        this.formLoading.set(false);
        this.closeFormDialog();
        this.closeSidePanel();
        this.createdProyectoId.set(null);
    }

    clearCreatedProyectoId() {
        this.createdProyectoId.set(null);
    }

    private resetFormState() {
        this.formOriginal.set(null);
        this.draft.set(null);
        this.formMode.set(null);
        this.formSubmitted.set(false);
        this.createdProyectoId.set(null);
    }

    // Mapeo de severidad de estado de proyecto para el tag en tabla
    getEstadoProyectoSeverity(estado: EstadoProyectoEnum) {
        switch (estado) {
            case 'PLANIFICADO':
                return 'info';
            case 'EN_EJECUCION':
                return 'success';
            case 'PAUSADO':
                return 'warn';
            case 'FINALIZADO':
                return 'danger';
            default:
                return 'info';
        }
    }

    // Mapeo de color de estado de etapa para chart y tags en timeline
    getEtapaStatusColor(estado: EstadoEtapaEnum) {
        return this.etapaStatusColors[estado] ?? this.etapaStatusColors.PENDIENTE;
    }

    // Mapeo de color de texto de estado de etapa para chart y tags en timeline
    getEtapaStatusTextColor(estado: EstadoEtapaEnum) {
        return estado === 'EN_PROGRESO' ? '#ffffff' : '#111827';
    }

    // Mapeo de datos para chart de etapas
    getEtapasChartData(proyecto: ProyectoListResponseDTO): ChartData<'doughnut'> {
        const total = proyecto.resumenEtapas?.totalEtapas ?? 0;
        const completed = proyecto.resumenEtapas?.totalEtapasCompletadas ?? 0;
        const active = proyecto.resumenEtapas?.etapaActiva ? 1 : 0;
        const pending = Math.max(total - completed - active, 0);

        return {
            datasets: [
                {
                    data: [completed, active, pending],
                    backgroundColor: [
                        this.etapaStatusColors.COMPLETADA,
                        this.etapaStatusColors.EN_PROGRESO,
                        this.etapaStatusColors.PENDIENTE
                    ],
                    borderWidth: 2
                }
            ]
        };
    }

    // Opciones para chart de etapas
    getEtapasChartOptions(): ChartOptions<'doughnut'> {
        return {
            animation: false,
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        };
    }

    // Carga de etapas del proyecto
    private loadEtapas(idProyecto: number) {
        this.etapasLoading.set(true);
        this.getEtapasByProyecto(idProyecto).subscribe({
            next: (response) => {
                const ordered = [...response].sort((a, b) => a.orden - b.orden);
                this.etapas.set(ordered);
            },
            error: (error) => {
                console.error('Error loading etapas:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error al cargar las etapas del proyecto.',
                    life: 5000
                });
                this.etapasLoading.set(false);
            },
            complete: () => {
                this.etapasLoading.set(false);
            }
        });
    }

    refreshEtapas() {
        const idProyecto = this.selectedProyectoId();
        if (!idProyecto) {
            return;
        }
        this.loadEtapas(idProyecto);
    }
}
