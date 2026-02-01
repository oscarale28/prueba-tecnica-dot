package dot.oscarorellana.proyecto;

import dot.oscarorellana.common.PaginatedResponse;
import dot.oscarorellana.etapa.EstadoEtapa;
import dot.oscarorellana.etapa.Etapa;
import dot.oscarorellana.proyecto.dto.EtapaSimpleDTO;
import dot.oscarorellana.proyecto.dto.EtapaResumenDTO;
import dot.oscarorellana.proyecto.dto.ProyectoListResponseDTO;
import dot.oscarorellana.proyecto.dto.ProyectoResponseDTO;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProyectoRepository implements PanacheRepository<Proyecto> {

    public PaginatedResponse<ProyectoListResponseDTO> findAllWithEtapasSummary(int page, int size) {
        int offset = Math.max(page - 1, 0) * size;

        List<Proyecto> proyectos = getEntityManager()
                .createQuery("select p from Proyecto p order by p.idProyecto", Proyecto.class)
                .setFirstResult(offset)
                .setMaxResults(size)
                .getResultList();

        List<Long> proyectoIds = proyectos.stream()
                .map(Proyecto::getIdProyecto)
                .collect(Collectors.toList());

        Map<Long, Long> totalEtapasByProyecto = new HashMap<>();
        Map<Long, Long> totalEtapasCompletadasByProyecto = new HashMap<>();
        Map<Long, EtapaSimpleDTO> activeEtapaByProyecto = new HashMap<>();

        if (!proyectoIds.isEmpty()) {
            List<Object[]> totals = getEntityManager()
                    .createQuery(
                            "select e.proyecto.idProyecto, count(e), " +
                                    "coalesce(sum(case when e.estado = :estadoCompletada then 1 else 0 end), 0) " +
                                    "from Etapa e where e.proyecto.idProyecto in :ids " +
                                    "group by e.proyecto.idProyecto",
                            Object[].class
                    )
                    .setParameter("ids", proyectoIds)
                    .setParameter("estadoCompletada", EstadoEtapa.COMPLETADA)
                    .getResultList();

            for (Object[] row : totals) {
                totalEtapasByProyecto.put((Long) row[0], (Long) row[1]);
                totalEtapasCompletadasByProyecto.put((Long) row[0], (Long) row[2]);
            }

            List<Etapa> activeEtapas = getEntityManager()
                    .createQuery(
                            "select e from Etapa e " +
                                    "where e.proyecto.idProyecto in :ids and e.estado = :estado",
                            Etapa.class
                    )
                    .setParameter("ids", proyectoIds)
                    .setParameter("estado", EstadoEtapa.EN_PROGRESO)
                    .getResultList();

            for (Etapa etapa : activeEtapas) {
                activeEtapaByProyecto.put(
                        etapa.getProyecto().getIdProyecto(),
                        new EtapaSimpleDTO(etapa.getNombre(), etapa.getOrden(), etapa.getEstado())
                );
            }
        }

        List<ProyectoListResponseDTO> data = proyectos.stream()
                .map(proyecto -> new ProyectoListResponseDTO(
                        proyecto.getIdProyecto(),
                        proyecto.getNombre(),
                        proyecto.getDescripcion(),
                        proyecto.getFechaInicio(),
                        proyecto.getFechaFin(),
                        proyecto.getEstado(),
                        new EtapaResumenDTO(
                                totalEtapasByProyecto.getOrDefault(proyecto.getIdProyecto(), 0L),
                                totalEtapasCompletadasByProyecto.getOrDefault(proyecto.getIdProyecto(), 0L),
                                activeEtapaByProyecto.get(proyecto.getIdProyecto())
                        )
                ))
                .collect(Collectors.toList());

        long totalElements = getEntityManager()
                .createQuery("select count(p) from Proyecto p", Long.class)
                .getSingleResult();
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / (double) size) : 0;

        return new PaginatedResponse<>(data, page, size, totalElements, totalPages);
    }

    public Optional<Proyecto> findByIdOptional(Long id) {
        return getEntityManager()
                .createQuery("select p from Proyecto p where p.idProyecto = :id", Proyecto.class)
                .setParameter("id", id)
                .getResultStream()
                .findFirst();
    }

    public Optional<ProyectoResponseDTO> findProyectoResumenById(Long id) {
        return findByIdOptional(id)
                .map(proyecto -> new ProyectoResponseDTO(
                        proyecto.getIdProyecto(),
                        proyecto.getNombre(),
                        proyecto.getDescripcion(),
                        proyecto.getFechaInicio(),
                        proyecto.getFechaFin(),
                        proyecto.getEstado()
                ));
    }

    @Transactional
    public Proyecto createProyecto(Proyecto proyecto) {
        persist(proyecto);
        return proyecto;
    }

    @Transactional
    public Proyecto updateProyecto(Proyecto proyecto) {

        boolean hasEtapasPendientes = hasEtapasNoCompletadas(proyecto.getIdProyecto());

        if (proyecto.getEstado() == EstadoProyecto.FINALIZADO && hasEtapasPendientes) {
            throw new IllegalStateException("No se puede finalizar el proyecto si aún existen etapas pendientes de completar.");
        }

        return getEntityManager().merge(proyecto);
    }

    public boolean hasEtapasNoCompletadas(Long proyectoId) {
        Long pendientes = getEntityManager()
                .createQuery(
                        "select count(e) from Etapa e " +
                                "where e.proyecto.idProyecto = :id and e.estado <> :estado",
                        Long.class
                )
                .setParameter("id", proyectoId)
                .setParameter("estado", EstadoEtapa.COMPLETADA)
                .getSingleResult();
        return pendientes != null && pendientes > 0;
    }

    @Transactional
    public void deleteProyecto(Proyecto proyecto) {
        delete(proyecto);
    }
}
