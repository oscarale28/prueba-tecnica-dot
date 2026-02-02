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
}
