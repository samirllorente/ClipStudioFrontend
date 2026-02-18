
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface SocialAccount {
    _id: string;
    platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
    providerName: string;
    metadata?: any;
}

@Injectable({
    providedIn: 'root'
})
export class SocialService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/social-accounts`;

    getAccounts(): Observable<SocialAccount[]> {
        return this.http.get<SocialAccount[]>(this.apiUrl);
    }

    connect(platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube'): Observable<SocialAccount> {
        return this.http.post<SocialAccount>(`${this.apiUrl}/connect`, { platform });
    }

    disconnect(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
