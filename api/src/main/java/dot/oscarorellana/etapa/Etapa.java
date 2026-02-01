package dot.oscarorellana.etapa;

import dot.oscarorellana.proyecto.Proyecto;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "DOT_ETAPA")
public class Etapa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ETAPA", nullable = false)
    private Long idEtapa;

    @Column(name="NOMBRE", nullable = false, length = 150)
    private String nombre;

    @Column(name="ORDEN", nullable = false)
    private Integer orden;

    @Column(name="FECHA_INICIO", nullable = false)
    private LocalDate fechaInicio;

    @Column(name="FECHA_FIN_ESTIMADA", nullable = false)
    private LocalDate fechaFinEstimada;

    @Column(name="PRESUPUESTO_ASIGNADO", nullable = false, precision = 15, scale = 2)
    private BigDecimal presupuestoAsignado;

    @Enumerated(EnumType.STRING)
    @Column(name="ESTADO", nullable = false, length = 20)
    private EstadoEtapa estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PROYECTO", nullable = false)
    private Proyecto proyecto;

    public Etapa() {
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

    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }

    @PrePersist
    @PreUpdate
    public void validateActiveEtapaUniqueness() {
        if (estado != EstadoEtapa.EN_PROGRESO || proyecto == null || proyecto.getEtapas() == null) {
            return;
        }

        long activeCount = proyecto.getEtapas().stream()
                .filter(etapa -> !this.equals(etapa))
                .filter(etapa -> etapa.getEstado() == EstadoEtapa.EN_PROGRESO)
                .count();

        if (activeCount > 0) {
            throw new IllegalStateException("Solo puede existir una etapa EN_PROGRESO por proyecto.");
        }
    }

    @Override
    public String toString() {
        return "Etapa{" +
                "idEtapa=" + idEtapa +
                ", nombre='" + nombre + '\'' +
                ", orden=" + orden +
                ", fechaInicio=" + fechaInicio +
                ", fechaFinEstimada=" + fechaFinEstimada +
                ", presupuestoAsignado=" + presupuestoAsignado +
                ", estado=" + estado +
                ", proyecto=" + proyecto +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;

        Etapa etapa = (Etapa) o;
        return Objects.equals(idEtapa, etapa.idEtapa) && Objects.equals(nombre, etapa.nombre) && Objects.equals(orden, etapa.orden) && Objects.equals(fechaInicio, etapa.fechaInicio) && Objects.equals(fechaFinEstimada, etapa.fechaFinEstimada) && Objects.equals(presupuestoAsignado, etapa.presupuestoAsignado) && estado == etapa.estado && Objects.equals(proyecto, etapa.proyecto);
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(idEtapa);
        result = 31 * result + Objects.hashCode(nombre);
        result = 31 * result + Objects.hashCode(orden);
        result = 31 * result + Objects.hashCode(fechaInicio);
        result = 31 * result + Objects.hashCode(fechaFinEstimada);
        result = 31 * result + Objects.hashCode(presupuestoAsignado);
        result = 31 * result + Objects.hashCode(estado);
        result = 31 * result + Objects.hashCode(proyecto);
        return result;
    }
}
