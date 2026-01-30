import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { Movie, ProductService } from '../service/product.service';

interface MovieWithRating extends Movie {
    rating: number;
}

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TagModule,
        InputIconModule,
        IconFieldModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <h5 class="m-0">Películas</h5>
            </ng-template>

            <ng-template #end>
                <p-button label="Exportar" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="peliculas()"
            [lazy]="true"
            [rows]="rows()"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['title', 'original_language', 'release_date']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            [totalRecords]="totalRecords()"
            [first]="first()"
            (onLazyLoad)="onPageChange($event)"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} películas"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            [loading]="loading()"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Buscar películas..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="min-width: 8rem">ID</th>
                    <th pSortableColumn="title" style="min-width:16rem">
                        Título
                        <p-sortIcon field="title" />
                    </th>
                    <th>Poster</th>
                    <th pSortableColumn="vote_average" style="min-width: 8rem">
                        Calificación
                        <p-sortIcon field="vote_average" />
                    </th>
                    <th pSortableColumn="original_language" style="min-width:10rem">
                        Idioma
                        <p-sortIcon field="original_language" />
                    </th>
                    <th pSortableColumn="release_date" style="min-width: 12rem">
                        Fecha de Estreno
                        <p-sortIcon field="release_date" />
                    </th>
                    <th pSortableColumn="vote_average" style="min-width: 12rem">
                        Estrellas
                        <p-sortIcon field="vote_average" />
                    </th>
                    <th style="min-width: 12rem">Estado</th>
                </tr>
            </ng-template>
            <ng-template #body let-pelicula>
                <tr>
                    <td style="min-width: 8rem">{{ pelicula.id }}</td>
                    <td style="min-width: 16rem">{{ pelicula.title }}</td>
                    <td>
                        <img 
                            [src]="getPosterUrl(pelicula.poster_path)" 
                            [alt]="pelicula.title" 
                            style="width: 64px; height: 96px; object-fit: cover;" 
                            class="rounded" 
                            *ngIf="pelicula.poster_path" 
                        />
                        <span *ngIf="!pelicula.poster_path">Sin imagen</span>
                    </td>
                    <td>{{ pelicula.vote_average | number: '1.1-1' }}</td>
                    <td>{{ pelicula.original_language.toUpperCase() }}</td>
                    <td>{{ pelicula.release_date | date: 'dd/MM/yyyy' }}</td>
                    <td>
                        <p-rating [(ngModel)]="pelicula.rating" [readonly]="true" />
                    </td>
                    <td>
                        <p-tag [value]="getStatusFromRating(pelicula.vote_average)" [severity]="getSeverity(getStatusFromRating(pelicula.vote_average))" />
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
    providers: [MessageService, ProductService]
})
export class Crud implements OnInit {
    peliculas = signal<MovieWithRating[]>([]);
    loading = signal<boolean>(true);
    totalRecords = signal<number>(0);
    first = signal<number>(0);
    rows = signal<number>(10);

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productService: ProductService,
        private messageService: MessageService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.initColumns();
        this.loadMovies(1, this.rows());
    }

    initColumns() {
        this.cols = [
            { field: 'id', header: 'ID', customExportHeader: 'ID Película' },
            { field: 'title', header: 'Título' },
            { field: 'poster_path', header: 'Poster' },
            { field: 'vote_average', header: 'Calificación' },
            { field: 'original_language', header: 'Idioma' },
            { field: 'release_date', header: 'Fecha de Estreno' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadMovies(page: number, rowsPerPage: number) {
        this.loading.set(true);
        this.productService.getMovies(page).subscribe({
            next: (response) => {
                const moviesWithRating = response.results.map(movie => ({
                    ...movie,
                    rating: Math.round(movie.vote_average / 2)
                }));
                this.peliculas.set(moviesWithRating);
                this.totalRecords.set(response.total_results);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading movies:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar películas. Por favor verifica tu token de API en el archivo .env',
                    life: 5000
                });
                this.loading.set(false);
            }
        });
    }

    onPageChange(event: any) {
        const page = Math.floor(event.first / event.rows) + 1;
        this.first.set(event.first);
        this.rows.set(event.rows);
        this.loadMovies(page, event.rows);
    }

    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    getPosterUrl(posterPath: string | null): string | null {
        return this.productService.getPosterUrl(posterPath);
    }

    getStatusFromRating(rating: number): string {
        return this.productService.getStatusFromRating(rating);
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }
}
