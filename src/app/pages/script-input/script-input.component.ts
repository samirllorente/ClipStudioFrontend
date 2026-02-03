import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { VideoService } from '../../core/services/video.service';
import { SocketService } from '../../core/services/socket.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-script-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, FormsModule],
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
    subtitleColor = signal<string>('#F4D03F'); // Default Yellow
    processingStatus = signal<'input' | 'processing' | 'preview' | 'generating' | 'completed'>('input');
    projectData = signal<any>(null);

    // Preview Player State
    isPlaying = signal(false);
    currentTime = signal(0);
    previewAudioElement: HTMLAudioElement | null = null;
    activeImage = signal<string | null>(null);
    activeSubtitle = signal<string>('');

    // Transitions & Effects
    previousImage = signal<string | null>(null);
    currentEffect = signal<string>('animate-intense-zoom');
    isTransitioning = signal(false);
    lastSegmentIndex = -1;
    segmentEffects: string[] = [];

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

                        // Subscribe to updates
                        this.socketService.onProjectUpdate().subscribe((data) => {
                            this.handleProjectUpdate(data, response.projectId);
                        });

                        // Check initial status in case we missed the event
                        this.videoService.getProject(response.projectId).subscribe(project => {
                            if (project && project.status !== 'processing' && project.status !== 'pending') {
                                this.handleProjectUpdate(project, response.projectId);
                            }
                        });
                    }
                });
        } else {
            this.scriptForm.markAllAsTouched();
        }
    }

    private handleProjectUpdate(data: any, projectId: string) {
        console.log('Project update/status:', data);
        if (data.status === 'draft_ready') {
            this.loadProjectPreview(projectId);
        } else if (data.status === 'completed' && data.videoUrl) {
            this.videoUrl.set(`${environment.apiUrl}/projects/${projectId}/final_video.mp4`);
            this.processingStatus.set('completed');
        } else if (data.status === 'failed') {
            this.errorMessage.set('VIDEO_GENERATION_FAILED');
            this.processingStatus.set('input');
        }
    }

    loadProjectPreview(projectId: string) {
        this.videoService.getProject(projectId).subscribe(project => {
            if (project) {
                // Pre-calculate URL for audio?
                // Ensure audioPath is absolute, we need to convert to relative for static serving
            }
            this.projectData.set(project);
            this.processingStatus.set('preview');

            // Init effects map
            this.segmentEffects = project.segments.map(() => Math.random() > 0.5 ? 'animate-intense-zoom' : 'animate-intense-orbital');

            // Init active image
            if (project.segments.length > 0) {
                this.activeImage.set(this.getImageUrl(project.segments[0].imagePath));
                this.currentEffect.set(this.segmentEffects[0]);
                this.lastSegmentIndex = 0;
            }
        });
    }

    regenerateImage(segmentIndex: number, newPrompt: string) {
        const id = this.projectId();
        if (!id) return;

        this.videoService.regenerateImage(id, segmentIndex, newPrompt).subscribe((updatedProject) => {
            if (updatedProject) {
                // Force refresh image by appending timestamp
                updatedProject.segments.forEach((s: any) => {
                    if (s.imagePath.startsWith('http')) return; // already processed or full url?
                    // assuming path is relative filename like /projects/:id/temp_clips/... or similar
                    // actually backend returns absolute path usually, we need to map to static url.
                    // For draft: Images are in projects/:id/image_X.png
                    // We need a helper to format URL
                });
                this.projectData.set(updatedProject);
            }
        });
    }

    onFileSelected(event: any, segmentIndex: number) {
        const file = event.target.files[0];
        if (!file) return;

        const id = this.projectId();
        if (!id) return;

        this.videoService.uploadImage(id, segmentIndex, file).subscribe((updatedProject) => {
            if (updatedProject) {
                this.projectData.set(updatedProject);

                // If this is the active segment in preview, update activeImage
                // Calculate current segment index based on time?
                // Or just force update if we know we are previewing *something*
                // Better: check if we are currently looking at this segment
                const duration = (updatedProject.audioDuration || 15);
                const segDuration = duration / updatedProject.segments.length;
                const currentIdx = Math.floor(this.currentTime() / segDuration);

                if (currentIdx === segmentIndex) {
                    this.activeImage.set(this.getImageUrl(updatedProject.segments[segmentIndex].imagePath));
                }
            }
        });
    }

    updateSubtitle(segmentIndex: number, subIndex: number, newText: string) {
        // This is complex because we need to know WHICH subtitle belongs to this segment
        // For now, let's assume we update the local state and send ALL subtitles to backend on change or finalize
        const project = this.projectData();
        if (project && project.subtitles) {
            const subtitles = [...project.subtitles];
            // Find the specific subtitle?
            // The UI will likely iterate over filtered subtitles. 
            // We need a way to map back to original array index if we filter.
            // Or we just update by reference if we manipulate the object directly in template (ngModel)
            // But with signals/immutable data it's harder.
            // Let's implement a bulk update method invoked by the user or just auto-save.
        }
    }

    // Helper to get URL
    getImageUrl(imagePath: string): string {
        // Backend saves absolute path e.g. /Users/.../projects/ID/img.png
        // We server static at /projects/ID/...
        // We need to extract filename
        if (!imagePath) return '';
        const filename = imagePath.split('/').pop();
        return `${environment.apiUrl}/projects/${this.projectId()}/${filename}?t=${new Date().getTime()}`;
    }

    getAudioUrl(): string {
        const path = this.projectData()?.audioPath;
        if (!path) return '';
        // If served statically like images
        const filename = path.split('/').pop();
        return `${environment.apiUrl}/projects/${this.projectId()}/${filename}`;
    }

    togglePlay() {
        if (!this.previewAudioElement) {
            this.previewAudioElement = new Audio(this.getAudioUrl());
            this.previewAudioElement.addEventListener('timeupdate', () => {
                this.currentTime.set(this.previewAudioElement!.currentTime);
                this.updatePreviewState();
            });
            this.previewAudioElement.addEventListener('ended', () => {
                this.isPlaying.set(false);
                this.currentTime.set(0);
            });
        }

        if (this.isPlaying()) {
            this.previewAudioElement.pause();
            this.isPlaying.set(false);
        } else {
            this.previewAudioElement.play();
            this.isPlaying.set(true);
        }
    }

    updatePreviewState() {
        const time = this.currentTime();
        const project = this.projectData();
        if (!project) return;

        // Find active segment/image
        const totalSegments = project.segments.length;
        const durationPerSegment = (project.audioDuration || 15) / totalSegments;
        const currentSegmentIndex = Math.min(Math.floor(time / durationPerSegment), totalSegments - 1);

        // Transition Logic
        if (currentSegmentIndex !== this.lastSegmentIndex) {
            const newImage = this.getImageUrl(project.segments[currentSegmentIndex]?.imagePath);

            if (this.lastSegmentIndex !== -1 && this.activeImage()) {
                // Start transition
                this.previousImage.set(this.activeImage());
                this.isTransitioning.set(true);

                // Clear transition after 1s (match CSS duration)
                setTimeout(() => {
                    this.isTransitioning.set(false);
                    this.previousImage.set(null);
                }, 1000);
            }

            this.activeImage.set(newImage);

            // Set effect for this segment
            if (this.segmentEffects[currentSegmentIndex]) {
                this.currentEffect.set(this.segmentEffects[currentSegmentIndex]);
            }

            this.lastSegmentIndex = currentSegmentIndex;
        }

        // Find active subtitle
        const sub = project.subtitles.find((s: any) => time >= s.start && time <= s.end);
        this.activeSubtitle.set(sub ? sub.text : '');
    }

    getSegmentSubtitles(segmentIndex: number): any[] {
        const project = this.projectData();
        if (!project) return [];

        // Calculate time range for this segment
        const totalSegments = project.segments.length;
        const durationPerSegment = (project.audioDuration || 15) / totalSegments;
        const startTime = segmentIndex * durationPerSegment;
        const endTime = (segmentIndex + 1) * durationPerSegment;

        // Filter subtitles that overlap with this range
        return project.subtitles.filter((s: any) => s.start >= startTime && s.start < endTime);
    }

    onSubtitleChange(sub: any, event: any) {
        sub.text = event.target.value;
        // Optional: Auto-save to backend or wait for finalize
        const id = this.projectId();
        if (id) {
            this.videoService.updateSubtitles(id, this.projectData().subtitles).subscribe();
        }
    }

    finalizeVideo() {
        const id = this.projectId();
        if (!id) return;
        this.processingStatus.set('generating');
        this.videoService.renderVideo(id, { subtitleColor: this.subtitleColor() }).subscribe(() => {
            // Status will update via socket to 'completed'
        });
    }

    setSubtitleColor(color: string) {
        this.subtitleColor.set(color);
    }
}
