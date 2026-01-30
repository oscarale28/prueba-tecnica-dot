import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    poster_path: string | null;
    backdrop_path: string | null;
    popularity: number;
    original_language: string;
    genre_ids: number[];
}

export interface MovieApiResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

@Injectable()
export class ProductService {
    private apiUrl = `${environment.tmdbApiUrl}/discover/movie`;
    private apiToken = environment.tmdbApiToken;

    constructor(private http: HttpClient) {}

    getMovies(page: number = 1): Observable<MovieApiResponse> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.apiToken}`,
            'Accept': 'application/json'
        });

        const params = new URLSearchParams();
        params.set('page', page.toString());

        return this.http.get<MovieApiResponse>(`${this.apiUrl}?${params.toString()}`, { headers });
    }

    getStatusFromRating(rating: number): string {
        if (rating >= 7) return 'INSTOCK';
        if (rating >= 5) return 'LOWSTOCK';
        return 'OUTOFSTOCK';
    }

    getPosterUrl(posterPath: string | null): string | null {
        return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
    }
}
