package dot.oscarorellana.proyecto.dto;

import dot.oscarorellana.etapa.Etapa;
import dot.oscarorellana.etapa.dto.EtapaResponseDTO;
import dot.oscarorellana.proyecto.Proyecto;
import dot.oscarorellana.proyecto.dto.EtapaResumenDTO;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProyectoMapper {

    public Proyecto toEntity(ProyectoCreateDTO dto) {
        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(dto.getNombre());
        proyecto.setDescripcion(dto.getDescripcion());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaFin(dto.getFechaFin());
        proyecto.setEstado(dto.getEstado());
        return proyecto;
    }

    public void updateEntityFromDto(Proyecto proyecto, ProyectoUpdateDTO dto) {
        proyecto.setNombre(dto.getNombre());
        proyecto.setDescripcion(dto.getDescripcion());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaFin(dto.getFechaFin());
        proyecto.setEstado(dto.getEstado());
    }

    public ProyectoResponseDTO toResponseDTO(Proyecto proyecto) {
        return new ProyectoResponseDTO(
            proyecto.getIdProyecto(),
            proyecto.getNombre(),
            proyecto.getDescripcion(),
            proyecto.getFechaInicio(),
            proyecto.getFechaFin(),
            proyecto.getEstado()
        );
    }

    public ProyectoListResponseDTO toListResponseDTO(Proyecto proyecto, Long totalEtapas, Long totalEtapasCompletadas,
                                                     Etapa etapaActiva) {
        EtapaSimpleDTO etapaActivaDto = null;
        if (etapaActiva != null) {
            etapaActivaDto = new EtapaSimpleDTO(
                    etapaActiva.getNombre(),
                    etapaActiva.getOrden(),
                    etapaActiva.getEstado()
            );
        }

        return new ProyectoListResponseDTO(
                proyecto.getIdProyecto(),
                proyecto.getNombre(),
                proyecto.getDescripcion(),
                proyecto.getFechaInicio(),
                proyecto.getFechaFin(),
                proyecto.getEstado(),
                new EtapaResumenDTO(totalEtapas, totalEtapasCompletadas, etapaActivaDto)
        );
    }

    public ProyectoDetailResponseDTO toDetailResponseDTO(Proyecto proyecto, List<Etapa> etapas) {
        List<EtapaResponseDTO> etapaDTOs = etapas.stream()
                .map(etapa -> new EtapaResponseDTO(
                        etapa.getIdEtapa(),
                        etapa.getNombre(),
                        etapa.getOrden(),
                        etapa.getFechaInicio(),
                        etapa.getFechaFinEstimada(),
                        etapa.getPresupuestoAsignado(),
                        etapa.getEstado(),
                        toResponseDTO(proyecto)
                ))
                .collect(Collectors.toList());

        return new ProyectoDetailResponseDTO(
                proyecto.getIdProyecto(),
                proyecto.getNombre(),
                proyecto.getDescripcion(),
                proyecto.getFechaInicio(),
                proyecto.getFechaFin(),
                proyecto.getEstado(),
                etapaDTOs
        );
    }
}
