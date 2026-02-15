
import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private tokenKey = 'auth_token';
    private apiUrl = 'http://localhost:3000/auth'; // Hardcoded for now

    // User Signal
    currentUser = signal<any>(null);
    isAuthenticated = computed(() => !!this.currentUser());

    constructor() {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const token = localStorage.getItem(this.tokenKey);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Assuming decoded token has user info, or fetch profile
                // For simplicity, just decode basic info from token if possible, or wait for explicit fetch
                // backend login returns { access_token, user }
                // Let's store user in localstorage too or fetch it.
                // For now, I'll store user object in localstorage on login
                const user = JSON.parse(localStorage.getItem('user_data') || 'null');
                if (user) {
                    this.currentUser.set(user);
                } else {
                    // Fallback if token exists but no user data (e.g. strict refresh)
                    this.currentUser.set({ email: (decoded as any).email, id: (decoded as any).sub });
                }
            } catch (e) {
                this.logout();
            }
        }
    }

    login(credentials: { email: string; password: string }) {
        return this.http.post<{ access_token: string; user: any }>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                this.setSession(response);
            })
        );
    }

    register(data: any) {
        return this.http.post<{ access_token: string; user: any }>(`${this.apiUrl}/register`, data).pipe(
            tap(response => {
                this.setSession(response);
            })
        );
    }

    googleLogin() {
        window.location.href = `${this.apiUrl}/google`;
    }

    handleCallback(token: string) {
        localStorage.setItem(this.tokenKey, token);
        const decoded = jwtDecode(token);
        // We don't have full user object here unless we fetch it.
        // Ideally backend returns user in body, but redirect with token in query params is tricky for body.
        // So fetch profile or just decode minimal info.
        // Let's fetch profile.
        // For now, minimal.
        this.currentUser.set({ email: (decoded as any).email, id: (decoded as any).sub });
        this.router.navigate(['/dashboard']);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('user_data');
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    private setSession(authResult: { access_token: string; user: any }) {
        localStorage.setItem(this.tokenKey, authResult.access_token);
        localStorage.setItem('user_data', JSON.stringify(authResult.user));
        this.currentUser.set(authResult.user);
        this.router.navigate(['/dashboard']);
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
}
