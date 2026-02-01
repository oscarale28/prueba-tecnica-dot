package dot.oscarorellana.proyecto;

import dot.oscarorellana.etapa.Etapa;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "DOT_PROYECTO")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PROYECTO", nullable = false)
    private Long idProyecto;

    @Basic
    @Column(name="NOMBRE", nullable = false, unique = true, length = 150)
    private String nombre;

    @Basic
    @Column(name="DESCRIPCION", length = 500)
    private String descripcion;

    @Basic
    @Column(name="FECHA_INICIO", nullable = false)
    private LocalDate fechaInicio;

    @Column(name="FECHA_FIN")
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(name="ESTADO", nullable = false, length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'PLANIFICADO'")
    private EstadoProyecto estado;

    @OneToMany(mappedBy = "proyecto", fetch = FetchType.LAZY)
    private List<Etapa> etapas;

    public Proyecto() {
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

    public List<Etapa> getEtapas() {
        return etapas;
    }

    public void setEtapas(List<Etapa> etapas) {
        this.etapas = etapas;
    }

    @Override
    public String toString() {
        return "Proyecto{" +
                "idProyecto=" + idProyecto +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", fechaInicio=" + fechaInicio +
                ", fechaFin=" + fechaFin +
                ", estado=" + estado +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;

        Proyecto proyecto = (Proyecto) o;
        return Objects.equals(idProyecto, proyecto.idProyecto) && Objects.equals(nombre, proyecto.nombre) && Objects.equals(descripcion, proyecto.descripcion) && Objects.equals(fechaInicio, proyecto.fechaInicio) && Objects.equals(fechaFin, proyecto.fechaFin) && estado == proyecto.estado;
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(idProyecto);
        result = 31 * result + Objects.hashCode(nombre);
        result = 31 * result + Objects.hashCode(descripcion);
        result = 31 * result + Objects.hashCode(fechaInicio);
        result = 31 * result + Objects.hashCode(fechaFin);
        result = 31 * result + Objects.hashCode(estado);
        return result;
    }
}
