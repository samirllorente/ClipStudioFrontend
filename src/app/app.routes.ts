import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/script-input/script-input.component').then(m => m.ScriptInputComponent)
    }
];
