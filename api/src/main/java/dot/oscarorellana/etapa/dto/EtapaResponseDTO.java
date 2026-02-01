package dot.oscarorellana.etapa.dto;

import dot.oscarorellana.etapa.EstadoEtapa;
import dot.oscarorellana.proyecto.dto.ProyectoResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EtapaResponseDTO {

    private Long idEtapa;
    private String nombre;
    private Integer orden;
    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;
    private BigDecimal presupuestoAsignado;
    private EstadoEtapa estado;
    private ProyectoResponseDTO proyecto;

    public EtapaResponseDTO() {
    }

    public EtapaResponseDTO(Long idEtapa, String nombre, Integer orden, 
                           LocalDate fechaInicio, LocalDate fechaFinEstimada, 
                           BigDecimal presupuestoAsignado, EstadoEtapa estado, 
                           ProyectoResponseDTO proyecto) {
        this.idEtapa = idEtapa;
        this.nombre = nombre;
        this.orden = orden;
        this.fechaInicio = fechaInicio;
        this.fechaFinEstimada = fechaFinEstimada;
        this.presupuestoAsignado = presupuestoAsignado;
        this.estado = estado;
        this.proyecto = proyecto;
    }

    public Long getIdEtapa() {
        return idEtapa;
    }

    public void setIdEtapa(Long idEtapa) {
        this.idEtapa = idEtapa;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFinEstimada() {
        return fechaFinEstimada;
    }

    public void setFechaFinEstimada(LocalDate fechaFinEstimada) {
        this.fechaFinEstimada = fechaFinEstimada;
    }

    public BigDecimal getPresupuestoAsignado() {
        return presupuestoAsignado;
    }

    public void setPresupuestoAsignado(BigDecimal presupuestoAsignado) {
        this.presupuestoAsignado = presupuestoAsignado;
    }

    public EstadoEtapa getEstado() {
        return estado;
    }

    public void setEstado(EstadoEtapa estado) {
        this.estado = estado;
    }

    public ProyectoResponseDTO getProyecto() {
        return proyecto;
    }

    public void setProyecto(ProyectoResponseDTO proyecto) {
        this.proyecto = proyecto;
    }
}
