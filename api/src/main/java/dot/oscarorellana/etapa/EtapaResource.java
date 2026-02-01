package dot.oscarorellana.etapa;

import dot.oscarorellana.common.HttpUtils;
import dot.oscarorellana.etapa.dto.*;
import dot.oscarorellana.proyecto.ProyectoService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

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
            return HttpUtils.badRequest("El parámetro proyectoId es obligatorio");
        }

        List<EtapaResponseDTO> etapaDTOs = etapaService.findEtapasByProyectoId(proyectoId);
        return Response.ok(etapaDTOs).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        return etapaService.findById(id)
                .map(etapa -> Response.ok(etapaMapper.toResponseDTO(etapa)).build())
                .orElse(HttpUtils.notFound("Etapa no encontrada con ID: " + id));
    }

    @POST
    public Response create(@Valid EtapaCreateDTO dto) {
        return proyectoService.findEntityById(dto.getProyectoId())
                .map(proyecto -> {
                    Etapa etapa = etapaMapper.toEntity(dto, proyecto);
                    try {
                        etapaService.validateEtapaStateTransition(etapa);
                    } catch (IllegalStateException ex) {
                        return HttpUtils.badRequest(ex.getMessage());
                    }
                    Etapa created = etapaService.create(etapa);
                    return Response.status(Response.Status.CREATED)
                            .entity(etapaMapper.toResponseDTO(created))
                            .build();
                })
                .orElse(HttpUtils.notFound("Proyecto no encontrado con ID: " + dto.getProyectoId()));
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
                                        return HttpUtils.badRequest(ex.getMessage());
                                    }
                                    Etapa updated = etapaService.update(existing);
                                    return Response.ok(etapaMapper.toResponseDTO(updated)).build();
                                })
                                .orElse(HttpUtils.notFound("Proyecto no encontrado con ID: " + dto.getProyectoId()));
                    }
                    
                    etapaMapper.updateEntityFromDto(existing, dto, null);
                    try {
                        etapaService.validateEtapaStateTransition(existing);
                    } catch (IllegalStateException ex) {
                        return HttpUtils.badRequest(ex.getMessage());
                    }
                    Etapa updated = etapaService.update(existing);
                    return Response.ok(etapaMapper.toResponseDTO(updated)).build();
                })
                .orElse(HttpUtils.notFound("Etapa no encontrada con ID: " + id));
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        return etapaService.findById(id)
                .map(etapa -> {
                    etapaService.delete(etapa);
                    return Response.noContent().build();
                })
                .orElse(HttpUtils.notFound("Etapa no encontrada con ID: " + id));
    }
}
