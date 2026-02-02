package dot.oscarorellana.etapa;

public enum EstadoEtapa {
    PENDIENTE,
    EN_PROGRESO,
    COMPLETADA;

    public EstadoEtapa getEstadoEtapaToUpdateTo(EstadoEtapa currentEstadoEtapa) {
        return switch(currentEstadoEtapa) {
            case PENDIENTE -> EN_PROGRESO;
            case EN_PROGRESO -> COMPLETADA;
            default -> throw new IllegalArgumentException("No se puede actualizar el estado desde: " + currentEstadoEtapa);
        };
    }
}
