package dot.oscarorellana.proyecto.dto;

import dot.oscarorellana.proyecto.EstadoProyecto;

import java.time.LocalDate;

public class ProyectoListResponseDTO {

    private Long idProyecto;
    private String nombre;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private EstadoProyecto estado;
    private EtapaResumenDTO resumenEtapas;

    public ProyectoListResponseDTO() {
    }

    public ProyectoListResponseDTO(Long idProyecto, String nombre, String descripcion,
                                   LocalDate fechaInicio, LocalDate fechaFin,
                                   EstadoProyecto estado, EtapaResumenDTO resumenEtapas) {
        this.idProyecto = idProyecto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.resumenEtapas = resumenEtapas;
    }

    public Long getIdProyecto() {
        return idProyecto;
    }

    public void setIdProyecto(Long idProyecto) {
        this.idProyecto = idProyecto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public EstadoProyecto getEstado() {
        return estado;
    }

    public void setEstado(EstadoProyecto estado) {
        this.estado = estado;
    }

    public EtapaResumenDTO getResumenEtapas() {
        return resumenEtapas;
    }

    public void setResumenEtapas(EtapaResumenDTO resumenEtapas) {
        this.resumenEtapas = resumenEtapas;
    }
}
