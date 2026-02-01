export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export type EstadoProyecto = 'PLANIFICADO' | 'EN_EJECUCION' | 'PAUSADO' | 'FINALIZADO';

export type EstadoEtapa = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';

export interface EtapaSimpleDTO {
    nombre: string;
    orden: number;
    estado: EstadoEtapa;
}

export interface EtapaResumenDTO {
    totalEtapas: number;
    totalEtapasCompletadas: number;
    etapaActiva: EtapaSimpleDTO | null;
}

export interface ProyectoListResponseDTO {
    idProyecto: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: EstadoProyecto;
    resumenEtapas: EtapaResumenDTO;
}

export interface ProyectoResponseDTO {
    idProyecto: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: EstadoProyecto;
}

export interface EtapaResponseDTO {
    idEtapa: number;
    nombre: string;
    orden: number;
    fechaInicio: string;
    fechaFinEstimada: string;
    presupuestoAsignado: number;
    estado: EstadoEtapa;
    proyecto: ProyectoResponseDTO;
}

export interface ProyectoDetailResponseDTO {
    idProyecto: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: EstadoProyecto;
    etapas: EtapaResponseDTO[];
}
