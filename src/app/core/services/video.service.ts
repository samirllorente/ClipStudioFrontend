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
    private musicUrl = `${environment.apiUrl}/music`;
    private apiUrl = `${environment.apiUrl}/scripts/process`;

    generateVideo(data: VideoScript): Observable<VideoResponse> {
        return this.http.post<VideoResponse>(this.apiUrl, data);
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

    updateSubtitleSettings(id: string, settings: any): Observable<any> {
        return this.http.put<any>(`${this.projectsUrl}/${id}/subtitle-settings`, settings);
    }

    uploadImage(projectId: string, segmentIndex: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.projectsUrl}/${projectId}/segment/${segmentIndex}/image-upload`, formData);
    }

    regenerateThumbnail(id: string, prompt?: string): Observable<any> {
        return this.http.put<any>(`${this.projectsUrl}/${id}/thumbnail/regenerate`, { prompt });
    }

    uploadThumbnail(id: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.projectsUrl}/${id}/thumbnail/upload`, formData);
    }

    renderVideo(id: string, options?: any): Observable<any> {
        return this.http.post<any>(`${this.projectsUrl}/${id}/render`, options || {});
    }

    getMusicList(): Observable<any[]> {
        return this.http.get<any[]>(this.musicUrl);
    }

    uploadMusic(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.musicUrl}/upload`, formData);
    }

    updateMusicSettings(id: string, settings: any): Observable<any> {
        return this.http.put<any>(`${this.projectsUrl}/${id}/music-settings`, settings);
    }

    uploadProjectMusic(projectId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.projectsUrl}/${projectId}/music/upload`, formData);
    }

    resumeGeneration(id: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/scripts/resume/${id}`, {});
    }
    publish(id: string, options: any): Observable<any> {
        return this.http.post<any>(`${this.projectsUrl}/${id}/publish`, options);
    }
}
