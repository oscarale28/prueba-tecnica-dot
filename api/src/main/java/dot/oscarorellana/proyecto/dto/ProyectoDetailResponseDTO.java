package dot.oscarorellana.proyecto.dto;

import dot.oscarorellana.etapa.dto.EtapaResponseDTO;
import dot.oscarorellana.proyecto.EstadoProyecto;

import java.time.LocalDate;
import java.util.List;

public class ProyectoDetailResponseDTO {

    private Long idProyecto;
    private String nombre;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private EstadoProyecto estado;
    private List<EtapaResponseDTO> etapas;

    public ProyectoDetailResponseDTO() {
    }

    public ProyectoDetailResponseDTO(Long idProyecto, String nombre, String descripcion,
                                     LocalDate fechaInicio, LocalDate fechaFin,
                                     EstadoProyecto estado, List<EtapaResponseDTO> etapas) {
        this.idProyecto = idProyecto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.etapas = etapas;
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

    public List<EtapaResponseDTO> getEtapas() {
        return etapas;
    }

    public void setEtapas(List<EtapaResponseDTO> etapas) {
        this.etapas = etapas;
    }
}
