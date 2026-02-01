import { Injectable } from '@angular/core';
import { ProyectoService } from './proyecto.service';

@Injectable()
export class ProyectoSyncService {
    constructor(private proyectoService: ProyectoService) { }

    refreshAfterEtapaUpdate() {
        this.proyectoService.loadProyectos();
        this.proyectoService.refreshEtapas();
    }
}
