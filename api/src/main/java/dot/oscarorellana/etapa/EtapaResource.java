package dot.oscarorellana.etapa;

import dot.oscarorellana.PaginatedResponse;
import dot.oscarorellana.etapa.dto.*;
import dot.oscarorellana.proyecto.ProyectoService;
import dot.oscarorellana.proyecto.Proyecto;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("/etapas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EtapaResource {

    @Inject
    EtapaService etapaService;

    @Inject
    ProyectoService proyectoService;

    @Inject
    EtapaMapper etapaMapper;

    @GET
    @Path("/proyecto/{proyectoId}")
    public Response findByProyectoId(@PathParam("proyectoId") Long proyectoId) {

        if (proyectoId == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El parámetro proyectoId es obligatorio")
                    .build();
        }

        List<EtapaResponseDTO> etapaDTOs = etapaService.findEtapasByProyectoId(proyectoId);
        return Response.ok(etapaDTOs).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        return etapaService.findById(id)
                .map(etapa -> Response.ok(etapaMapper.toResponseDTO(etapa)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity("Etapa no encontrada con ID: " + id)
                        .build());
    }

    @POST
    public Response create(@Valid EtapaCreateDTO dto) {
        return proyectoService.findEntityById(dto.getProyectoId())
                .map(proyecto -> {
                    Etapa etapa = etapaMapper.toEntity(dto, proyecto);
                    try {
                        etapaService.validateEtapaStateTransition(etapa);
                    } catch (IllegalStateException ex) {
                        return Response.status(Response.Status.BAD_REQUEST)
                                .entity(ex.getMessage())
                                .build();
                    }
                    Etapa created = etapaService.create(etapa);
                    return Response.status(Response.Status.CREATED)
                            .entity(etapaMapper.toResponseDTO(created))
                            .build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity("Proyecto no encontrado con ID: " + dto.getProyectoId())
                        .build());
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid EtapaUpdateDTO dto) {
        return etapaService.findById(id)
                .map(existing -> {
                    // Update proyecto if provided
                    if (dto.getProyectoId() != null) {
                        return proyectoService.findEntityById(dto.getProyectoId())
                                .map(proyecto -> {
                                    etapaMapper.updateEntityFromDto(existing, dto, proyecto);
                                    try {
                                        etapaService.validateEtapaStateTransition(existing);
                                    } catch (IllegalStateException ex) {
                                        return Response.status(Response.Status.BAD_REQUEST)
                                                .entity(ex.getMessage())
                                                .build();
                                    }
                                    Etapa updated = etapaService.update(existing);
                                    return Response.ok(etapaMapper.toResponseDTO(updated)).build();
                                })
                                .orElse(Response.status(Response.Status.NOT_FOUND)
                                        .entity("Proyecto no encontrado con ID: " + dto.getProyectoId())
                                        .build());
                    }
                    
                    etapaMapper.updateEntityFromDto(existing, dto, null);
                    try {
                        etapaService.validateEtapaStateTransition(existing);
                    } catch (IllegalStateException ex) {
                        return Response.status(Response.Status.BAD_REQUEST)
                                .entity(ex.getMessage())
                                .build();
                    }
                    Etapa updated = etapaService.update(existing);
                    return Response.ok(etapaMapper.toResponseDTO(updated)).build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity("Etapa no encontrada con ID: " + id)
                        .build());
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        return etapaService.findById(id)
                .map(etapa -> {
                    etapaService.delete(etapa);
                    return Response.noContent().build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity("Etapa no encontrada con ID: " + id)
                        .build());
    }
}
