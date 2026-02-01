package dot.oscarorellana;

import io.quarkus.hibernate.orm.panache.PanacheQuery;

import java.util.List;

public record PaginatedResponse<T>(List<T> data, int page, int size, long totalElements, int totalPages) {

    public PaginatedResponse(PanacheQuery<T> query) {
       this(query.list(), query.page().index + 1, query.pageCount(), query.count(), query.pageCount());
    }
}