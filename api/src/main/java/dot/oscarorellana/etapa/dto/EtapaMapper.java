package dot.oscarorellana.etapa.dto;

import dot.oscarorellana.etapa.Etapa;
import dot.oscarorellana.proyecto.Proyecto;
import dot.oscarorellana.proyecto.dto.ProyectoMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class EtapaMapper {

    @Inject
    ProyectoMapper proyectoMapper;

    public Etapa toEntity(EtapaCreateDTO dto, Proyecto proyecto) {
        Etapa etapa = new Etapa();
        etapa.setNombre(dto.getNombre());
        etapa.setOrden(dto.getOrden());
        etapa.setFechaInicio(dto.getFechaInicio());
        etapa.setFechaFinEstimada(dto.getFechaFinEstimada());
        etapa.setPresupuestoAsignado(dto.getPresupuestoAsignado());
        etapa.setEstado(dto.getEstado());
        etapa.setProyecto(proyecto);
        return etapa;
    }

    public void updateEntityFromInfoDto(Etapa etapa, EtapaInfoUpdateDTO dto) {
        etapa.setNombre(dto.getNombre());
        etapa.setOrden(dto.getOrden());
        etapa.setFechaInicio(dto.getFechaInicio());
        etapa.setFechaFinEstimada(dto.getFechaFinEstimada());
        etapa.setPresupuestoAsignado(dto.getPresupuestoAsignado());
    }

    public EtapaResponseDTO toResponseDTO(Etapa etapa) {
        return new EtapaResponseDTO(
            etapa.getIdEtapa(),
            etapa.getNombre(),
            etapa.getOrden(),
            etapa.getFechaInicio(),
            etapa.getFechaFinEstimada(),
            etapa.getPresupuestoAsignado(),
            etapa.getEstado()
        );
    }
}
