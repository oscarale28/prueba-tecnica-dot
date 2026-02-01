package dot.oscarorellana.proyecto;

import dot.oscarorellana.PaginatedResponse;
import dot.oscarorellana.proyecto.dto.ProyectoCreateDTO;
import dot.oscarorellana.proyecto.dto.ProyectoListResponseDTO;
import dot.oscarorellana.proyecto.dto.ProyectoMapper;
import dot.oscarorellana.proyecto.dto.ProyectoUpdateDTO;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/proyectos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProyectoResource {

    @Inject
    ProyectoService proyectoService;

    @Inject
    ProyectoMapper proyectoMapper;

    @GET
    public Response findAll(@QueryParam("page") @DefaultValue("1") int page,
                            @QueryParam("size") @DefaultValue("10") int size) {
        if (page < 1 || size < 1) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Los parámetros page y size deben ser mayores a 0")
                    .build();
        }
        
        PaginatedResponse<ProyectoListResponseDTO> response = proyectoService.findAll(page, size);
        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        return proyectoService.findById(id)
                .map(dto -> Response.ok(dto).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity("Proyecto no encontrado con ID: " + id)
                        .build());
    }

    @POST
    public Response create(@Valid ProyectoCreateDTO dto) {
        Proyecto proyecto = proyectoMapper.toEntity(dto);
        Proyecto created = proyectoService.create(proyecto);
        return Response.status(Response.Status.CREATED)
                .entity(proyectoMapper.toResponseDTO(created))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid ProyectoUpdateDTO dto) {
        return proyectoService.findEntityById(id)
                .map(existing -> {
                    proyectoMapper.updateEntityFromDto(existing, dto);
                    Proyecto updated = proyectoService.update(existing);
                    return Response.ok(proyectoMapper.toResponseDTO(updated)).build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity("Proyecto no encontrado con ID: " + id)
                        .build());
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        return proyectoService.findEntityById(id)
                .map(proyecto -> {
                    proyectoService.delete(proyecto);
                    return Response.noContent().build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity("Proyecto no encontrado con ID: " + id)
                        .build());
    }
}
