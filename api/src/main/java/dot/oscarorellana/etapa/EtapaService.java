package dot.oscarorellana.etapa;

import dot.oscarorellana.common.PaginatedResponse;
import dot.oscarorellana.etapa.dto.EtapaResponseDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class EtapaService {

    @Inject
    EtapaRepository etapaRepository;

    public PaginatedResponse<Etapa> findAll(int page, int size) {
        return etapaRepository.findAllPaginated(page, size);
    }

    public Optional<Etapa> findById(Long id) {
        return etapaRepository.findByIdOptional(id);
    }


    public List<EtapaResponseDTO> findEtapasByProyectoId(Long proyectoId) {
        return etapaRepository.findEtapasByProyectoId(proyectoId);
    }

    public List<Etapa> findAll() {
        return etapaRepository.listAll();
    }

    public void validateEtapaStateTransition(Etapa etapa) {
        if (etapa.getEstado() != EstadoEtapa.EN_PROGRESO) {
            return;
        }

        if (etapa.getProyecto() == null || etapa.getProyecto().getIdProyecto() == null) {
            throw new IllegalStateException("El proyecto asociado es obligatorio para validar la etapa.");
        }

        long etapasPendientes = etapaRepository.countIncompletePreviousEtapasBeforeOrden(
                etapa.getProyecto().getIdProyecto(),
                etapa.getOrden()
        );

        if (etapasPendientes > 0) {
            throw new IllegalStateException("Debe completar las etapas anteriores antes de iniciar esta etapa.");
        }
    }

    public Etapa create(Etapa etapa) {
        return etapaRepository.createEtapa(etapa);
    }

    public Etapa update(Etapa etapa) {
        return etapaRepository.updateEtapa(etapa);
    }

    public void delete(Etapa etapa) {
        etapaRepository.deleteEtapa(etapa);
    }
}
