import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Crud } from './app/pages/crud/crud';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Crud }
        ]
    }
];
