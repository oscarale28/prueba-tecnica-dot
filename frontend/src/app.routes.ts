import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { ProyectosComponent } from './app/pages/proyectos/proyectos.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'proyectos' },
            { path: 'proyectos', component: ProyectosComponent }
        ]
    }
];
