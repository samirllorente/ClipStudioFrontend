
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './pages/dashboard/layout/dashboard-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            { path: 'login', loadComponent: () => import('./pages/auth/components/login/login.component').then(m => m.LoginComponent) },
            { path: 'register', loadComponent: () => import('./pages/auth/components/register/register.component').then(m => m.RegisterComponent) },
            { path: 'callback', loadComponent: () => import('./pages/auth/components/callback/callback.component').then(m => m.CallbackComponent) }
        ]
    },
    {
        path: 'terms',
        loadComponent: () => import('./pages/legal/terms-of-service/terms-of-service.component').then(m => m.TermsOfServiceComponent)
    },
    {
        path: 'privacy',
        loadComponent: () => import('./pages/legal/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
    },

    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'videos', pathMatch: 'full' },
            { path: 'videos', loadComponent: () => import('./pages/dashboard/components/video-list/video-list.component').then(m => m.VideoListComponent) },
            { path: 'social', loadComponent: () => import('./pages/dashboard/components/social-config/social-config').then(m => m.SocialConfigComponent) },
            { path: 'create', loadComponent: () => import('./pages/script-input/script-input.component').then(m => m.ScriptInputComponent) },
            { path: 'edit/:id', loadComponent: () => import('./pages/script-input/script-input.component').then(m => m.ScriptInputComponent) }
        ]
    }
];
