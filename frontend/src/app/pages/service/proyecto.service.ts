import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ChartData, ChartOptions } from 'chart.js';
import { environment } from '../../../environments/environment';
import {
    EstadoEtapa,
    EstadoProyecto,
    EtapaResponseDTO,
    PaginatedResponse,
    ProyectoDetailResponseDTO,
    ProyectoListResponseDTO
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

    readonly etapas = signal<EtapaResponseDTO[]>([]);
    readonly etapasLoading = signal<boolean>(false);
    readonly dialogOpen = signal<boolean>(false);
    readonly selectedProyecto = signal<ProyectoListResponseDTO | null>(null);

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

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

    // Consulta paginada de proyectos
    loadProyectos(page: number, size: number) {
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
        this.selectedProyecto.set(proyecto);
        this.dialogOpen.set(true);
        this.etapas.set([]);
        this.loadEtapas(proyecto.idProyecto);
    }

    // Cierre del diálogo de etapas
    closeEtapasDialog() {
        this.dialogOpen.set(false);
        this.selectedProyecto.set(null);
        this.etapas.set([]);
    }

    // Mapeo de severidad de estado de proyecto para el tag en tabla
    getEstadoProyectoSeverity(estado: EstadoProyecto) {
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
    getEtapaStatusColor(estado: EstadoEtapa) {
        return this.etapaStatusColors[estado] ?? this.etapaStatusColors.PENDIENTE;
    }

    // Mapeo de color de texto de estado de etapa para chart y tags en timeline
    getEtapaStatusTextColor(estado: EstadoEtapa) {
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
}
