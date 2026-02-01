package dot.oscarorellana.proyecto;

import dot.oscarorellana.common.PaginatedResponse;
import dot.oscarorellana.proyecto.dto.ProyectoListResponseDTO;
import dot.oscarorellana.proyecto.dto.ProyectoResponseDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.Optional;

@ApplicationScoped
public class ProyectoService {

    @Inject
    ProyectoRepository proyectoRepository;

    public PaginatedResponse<ProyectoListResponseDTO> findAll(int page, int size) {
        return proyectoRepository.findAllWithEtapasSummary(page, size);
    }

    public Optional<ProyectoResponseDTO> findById(Long id) {
        return proyectoRepository.findProyectoResumenById(id);
    }

    public Optional<Proyecto> findEntityById(Long id) {
        return proyectoRepository.findByIdOptional(id);
    }

    public Proyecto create(Proyecto proyecto) {
        return proyectoRepository.createProyecto(proyecto);
    }

    public Proyecto update(Proyecto proyecto)  {
        return proyectoRepository.updateProyecto(proyecto);
    }

    public void delete(Proyecto proyecto) {
        proyectoRepository.deleteProyecto(proyecto);
    }
}
