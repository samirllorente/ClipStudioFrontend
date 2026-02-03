import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoScript, VideoResponse } from '../models/video.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VideoService {
    private http = inject(HttpClient);
    // Default NestJS port is usually 3000
    // Note: Project related endpoints might be under /projects in backend, but let's assume consistent API usage
    private projectsUrl = `${environment.apiUrl}/projects`;
    private apiUrl = `${environment.apiUrl}/scripts/process`;

    generateVideo(script: string): Observable<VideoResponse> {
        const payload: VideoScript = { script };
        return this.http.post<VideoResponse>(this.apiUrl, payload);
    }

    getProject(id: string): Observable<any> {
        return this.http.get<any>(`${this.projectsUrl}/${id}`);
    }

    regenerateImage(id: string, segmentIndex: number, prompt: string): Observable<any> {
        return this.http.put<any>(`${this.projectsUrl}/${id}/segment/${segmentIndex}/image`, { prompt });
    }

    updateSubtitles(id: string, subtitles: any[]): Observable<any> {
        return this.http.put<any>(`${this.projectsUrl}/${id}/subtitles`, { subtitles });
    }

    renderVideo(id: string, options?: any): Observable<any> {
        return this.http.post<any>(`${this.projectsUrl}/${id}/render`, options || {});
    }
}
