package dot.oscarorellana.proyecto.dto;

import dot.oscarorellana.etapa.EstadoEtapa;

public class EtapaSimpleDTO {

    private String nombre;
    private Integer orden;
    private EstadoEtapa estado;

    public EtapaSimpleDTO() {
    }

    public EtapaSimpleDTO(String nombre, Integer orden, EstadoEtapa estado) {
        this.nombre = nombre;
        this.orden = orden;
        this.estado = estado;
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

    public EstadoEtapa getEstado() {
        return estado;
    }

    public void setEstado(EstadoEtapa estado) {
        this.estado = estado;
    }
}
