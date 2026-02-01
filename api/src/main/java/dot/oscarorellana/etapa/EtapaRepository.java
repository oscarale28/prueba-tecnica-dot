package dot.oscarorellana.etapa;

import dot.oscarorellana.PaginatedResponse;
import dot.oscarorellana.etapa.dto.EtapaResponseDTO;
import dot.oscarorellana.proyecto.dto.ProyectoResponseDTO;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class EtapaRepository implements PanacheRepository<Etapa> {

    public PaginatedResponse<Etapa> findAllPaginated(int page, int size) {
        PanacheQuery<Etapa> query = findAll();
        query.page(Page.of(page - 1, size));
        return new PaginatedResponse<>(query);
    }

    public Optional<Etapa> findByIdOptional(Long id) {
        return getEntityManager()
                .createQuery("select e from Etapa e where e.idEtapa = :id", Etapa.class)
                .setParameter("id", id)
                .getResultStream()
                .findFirst();
    }

    public long countByProyectoId(Long proyectoId) {
        return getEntityManager()
                .createQuery("select count(e) from Etapa e where e.proyecto.idProyecto = :proyectoId", Long.class)
                .setParameter("proyectoId", proyectoId)
                .getSingleResult();
    }

    public List<EtapaResponseDTO> findEtapasByProyectoId(Long proyectoId) {
        return find("proyecto.idProyecto = ?1", proyectoId)
                .stream().map(etapa -> new EtapaResponseDTO(
                        etapa.getIdEtapa(),
                        etapa.getNombre(),
                        etapa.getOrden(),
                        etapa.getFechaInicio(),
                        etapa.getFechaFinEstimada(),
                        etapa.getPresupuestoAsignado(),
                        etapa.getEstado(),
                        etapa.getProyecto() != null ? new ProyectoResponseDTO(
                                etapa.getProyecto().getIdProyecto(),
                                etapa.getProyecto().getNombre(),
                                etapa.getProyecto().getDescripcion(),
                                etapa.getProyecto().getFechaInicio(),
                                etapa.getProyecto().getFechaFin(),
                                etapa.getProyecto().getEstado()
                        ) : null
                )).toList();
    }

    public Optional<Etapa> findActiveEtapaByProyectoId(Long proyectoId) {
        return getEntityManager()
                .createQuery(
                        "select e from Etapa e where e.proyecto.idProyecto = :proyectoId and e.estado = :estado",
                        Etapa.class
                )
                .setParameter("proyectoId", proyectoId)
                .setParameter("estado", EstadoEtapa.EN_PROGRESO)
                .getResultStream()
                .findFirst();
    }

    public long countIncompletePreviousEtapasBeforeOrden(Long proyectoId, Integer orden) {
        return getEntityManager()
                .createQuery(
                        "select count(e) from Etapa e where e.proyecto.idProyecto = :proyectoId " +
                                "and e.orden < :orden and e.estado <> :estado",
                        Long.class
                )
                .setParameter("proyectoId", proyectoId)
                .setParameter("orden", orden)
                .setParameter("estado", EstadoEtapa.COMPLETADA)
                .getSingleResult();
    }

    @Transactional
    public Etapa createEtapa(Etapa etapa) {
        persist(etapa);
        return etapa;
    }

    @Transactional
    public Etapa updateEtapa(Etapa etapa) {
        return getEntityManager().merge(etapa);
    }

    @Transactional
    public void deleteEtapa(Etapa etapa) {
        delete(etapa);
    }
}
