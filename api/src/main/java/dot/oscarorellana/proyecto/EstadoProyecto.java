package dot.oscarorellana.proyecto;

public enum EstadoProyecto {
    PLANIFICADO,
    EN_EJECUCION,
    PAUSADO,
    FINALIZADO;

    public boolean canUpdateEstadoProyecto(EstadoProyecto newEstadoProyecto) {
        return switch(this) {
            case PLANIFICADO -> newEstadoProyecto == EN_EJECUCION || newEstadoProyecto == PAUSADO || newEstadoProyecto == PLANIFICADO;
            case EN_EJECUCION -> newEstadoProyecto == PAUSADO || newEstadoProyecto == FINALIZADO || newEstadoProyecto == EN_EJECUCION;
            case PAUSADO -> newEstadoProyecto == EN_EJECUCION || newEstadoProyecto == PAUSADO;
            case FINALIZADO -> false;
        };
    }
}
