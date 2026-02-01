export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export type EstadoProyecto = 'PLANIFICADO' | 'EN_EJECUCION' | 'PAUSADO' | 'FINALIZADO';

export enum ProyectoPanel {
    Etapas = 'etapas',
    Form = 'form'
}

export enum EstadoProyectoEnum {
    PLANIFICADO = 'PLANIFICADO',
    EN_EJECUCION = 'EN_EJECUCION',
    PAUSADO = 'PAUSADO',
    FINALIZADO = 'FINALIZADO'
}

export const ESTADO_PROYECTO_OPTIONS: { label: string; value: EstadoProyecto }[] = [
    { label: 'Planificado', value: 'PLANIFICADO' },
    { label: 'En ejecución', value: 'EN_EJECUCION' },
    { label: 'Pausado', value: 'PAUSADO' },
    { label: 'Finalizado', value: 'FINALIZADO' }
];

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

export interface ProyectoUpdateDTO {
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string | null;
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
