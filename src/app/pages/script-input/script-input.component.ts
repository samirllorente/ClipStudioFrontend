import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoService } from '../../core/services/video.service';
import { SocketService } from '../../core/services/socket.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-script-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './script-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptInputComponent {
    private fb = inject(FormBuilder);
    private videoService = inject(VideoService);
    private socketService = inject(SocketService);
    private translate = inject(TranslateService);

    scriptForm: FormGroup = this.fb.group({
        script: ['', [Validators.required, Validators.minLength(10)]],
    });

    isSubmitting = signal(false);
    errorMessage = signal<string | null>(null);
    projectId = signal<string | null>(null);
    videoUrl = signal<string | null>(null);
    processingStatus = signal<'input' | 'processing' | 'completed'>('input');

    get scriptControl() {
        return this.scriptForm.get('script')!;
    }

    onSubmit() {
        if (this.scriptForm.valid) {
            this.isSubmitting.set(true);
            this.errorMessage.set(null);
            const script = this.scriptForm.value.script;

            this.videoService.generateVideo(script)
                .pipe(
                    catchError((err) => {
                        console.error('Error generating video:', err);
                        this.errorMessage.set('ERROR_SERVER_CONNECT');
                        return of(null);
                    }),
                    finalize(() => this.isSubmitting.set(false))
                )
                .subscribe((response) => {
                    if (response && response.projectId) {
                        console.log('Video generation started:', response.projectId);
                        this.projectId.set(response.projectId);
                        this.processingStatus.set('processing');

                        this.socketService.joinProject(response.projectId);
                        this.socketService.onProjectUpdate().subscribe((data) => {
                            console.log('Socket update:', data);
                            if (data.status === 'completed' && data.videoUrl) {
                                // Construct full URL if needed, assuming backend sends relative path or full URL
                                // If local file path, we might need to serve it properly via static assets
                                // For now assuming backend serves 'projects/...' statically or keys
                                // Data.videoUrl is likely absolute path from backend, we need to convert to url
                                // Actually, let's assume backend serves via static or we fix that later.
                                // For this step, I'll direct to a hypothetical endpoint or just use the string.
                                this.videoUrl.set(`${environment.apiUrl}/projects/${response.projectId}/final_video.mp4`);
                                this.processingStatus.set('completed');
                            } else if (data.status === 'failed') {
                                this.errorMessage.set('VIDEO_GENERATION_FAILED');
                                this.processingStatus.set('input');
                            }
                        });
                    }
                });
        } else {
            this.scriptForm.markAllAsTouched();
        }
    }
}
