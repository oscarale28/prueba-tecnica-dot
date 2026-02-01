package dot.oscarorellana.common;

import jakarta.ws.rs.core.Response;

public class HttpUtils {

    public static Response success(String message) {
        return Response.status(Response.Status.OK)
                .entity(new BaseResponse(Response.Status.OK.getStatusCode(), message))
                .build();
    }

    public static Response badRequest(String message) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(new BaseResponse(Response.Status.BAD_REQUEST.getStatusCode(), message))
                .build();
    }

    public static Response notFound(String message) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity(new BaseResponse(Response.Status.NOT_FOUND.getStatusCode(), message))
                .build();
    }

    public static Response conflict(String message) {
        return Response.status(Response.Status.CONFLICT)
                .entity(new BaseResponse(Response.Status.CONFLICT.getStatusCode(), message))
                .build();
    }

    public static Response internalServerError(String message) {
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(new BaseResponse(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), message))
                .build();
    }
}
