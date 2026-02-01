export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

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

export const ESTADO_PROYECTO_OPTIONS: { label: string; value: EstadoProyectoEnum }[] = [
    { label: 'Planificado', value: EstadoProyectoEnum.PLANIFICADO },
    { label: 'En ejecución', value: EstadoProyectoEnum.EN_EJECUCION },
    { label: 'Pausado', value: EstadoProyectoEnum.PAUSADO },
    { label: 'Finalizado', value: EstadoProyectoEnum.FINALIZADO }
];

export enum EstadoEtapaEnum {
    PENDIENTE = 'PENDIENTE',
    EN_PROGRESO = 'EN_PROGRESO',
    COMPLETADA = 'COMPLETADA'
}

export interface EtapaSimpleDTO {
    nombre: string;
    orden: number;
    estado: EstadoEtapaEnum;
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
    estado: EstadoProyectoEnum;
    resumenEtapas: EtapaResumenDTO;
}

export interface ProyectoResponseDTO {
    idProyecto: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: EstadoProyectoEnum;
}

export interface ProyectoUpdateDTO {
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string | null;
    estado: EstadoProyectoEnum;
}

export interface EtapaResponseDTO {
    idEtapa: number;
    nombre: string;
    orden: number;
    fechaInicio: string;
    fechaFinEstimada: string;
    presupuestoAsignado: number;
    estado: EstadoEtapaEnum;
    proyecto: ProyectoResponseDTO;
}

export interface EtapaUpdateDTO {
    nombre: string;
    orden: number;
    fechaInicio: string;
    fechaFinEstimada: string;
    presupuestoAsignado: number;
}

export interface ProyectoDetailResponseDTO {
    idProyecto: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: EstadoProyectoEnum;
    etapas: EtapaResponseDTO[];
}
