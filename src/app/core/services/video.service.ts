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
    private apiUrl = `${environment.apiUrl}/scripts/process`;

    generateVideo(script: string): Observable<VideoResponse> {
        const payload: VideoScript = { script };
        return this.http.post<VideoResponse>(this.apiUrl, payload);
    }
}
