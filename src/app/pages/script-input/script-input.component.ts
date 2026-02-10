import { ChangeDetectionStrategy, Component, inject, signal, effect, OnDestroy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { VideoService } from '../../core/services/video.service';
import { SocketService } from '../../core/services/socket.service';
import { PlayerService } from '../../core/services/player.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { VIDEO_CONSTANTS, ProcessingStatus } from '../../core/constants/video.constants';

import { ScriptFormComponent } from './components/script-form/script-form.component';
import { PreviewPlayerComponent } from './components/preview-player/preview-player.component';
import { SegmentListComponent } from './components/segment-list/segment-list.component';
import { VideoResultComponent } from './components/video-result/video-result.component';

import { SubtitleEditorComponent } from './components/subtitle-editor/subtitle-editor.component';
import { ThumbnailEditorComponent } from './components/thumbnail-editor/thumbnail-editor.component';
import { SubtitleSettingsPanelComponent } from './components/subtitle-settings-panel/subtitle-settings-panel.component';

@Component({
    selector: 'app-script-input',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ScriptFormComponent,
        PreviewPlayerComponent,
        SegmentListComponent,
        VideoResultComponent,
        VideoResultComponent,
        SubtitleEditorComponent,
        ThumbnailEditorComponent,
        SubtitleSettingsPanelComponent
    ],
    templateUrl: './script-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptInputComponent implements OnDestroy, OnInit {
    private videoService = inject(VideoService);
    private socketService = inject(SocketService);
    public playerService = inject(PlayerService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    isSubmitting = signal(false);
    errorMessage = signal<string | null>(null);
    projectId = signal<string | null>(null);
    videoUrl = signal<string | null>(null);

    // Subtitle Settings State
    subtitleSettings = signal<any>({
        fontSize: 30,
        fontFamily: 'Permanent Marker',
        color: VIDEO_CONSTANTS.DEFAULT_SUBTITLE_COLOR,
        yPosition: 50,
        letterSpacing: 0,
        showSubtitles: true
    });
    showSubtitles = computed(() => this.subtitleSettings().showSubtitles);

    subtitleEditorOpen = signal(false);

    processingStatus = signal<ProcessingStatus>(VIDEO_CONSTANTS.STATUS.INPUT);
    projectData = signal<any>(null);

    // Thumbnail state
    thumbnailUrl = computed(() => {
        const project = this.projectData();
        return project?.thumbnailPath ? this.getImageUrl(project.thumbnailPath) : null;
    });
    thumbnailPrompt = computed(() => this.projectData()?.thumbnailPrompt || '');
    isThumbnailLoading = signal(false);

    // Derived view state
    activeImage = signal<string | null>(null);
    activeSubtitle = signal<string>('');
    previousImage = signal<string | null>(null);
    currentEffect = signal<string>(VIDEO_CONSTANTS.ANIMATIONS.ZOOM);
    isTransitioning = signal(false);

    private lastSegmentIndex = -1;
    private segmentEffects: string[] = [];

    constructor() {
        // React to time updates from PlayerService to update preview
        effect(() => {
            if (this.processingStatus() === VIDEO_CONSTANTS.STATUS.PREVIEW) {
                this.updatePreviewState(this.playerService.currentTime());
            }
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const projectId = params['id'];
            if (projectId) {
                this.projectId.set(projectId);
                this.loadProjectState(projectId);
            }
        });
    }

    loadProjectState(projectId: string) {
        this.videoService.getProject(projectId).subscribe({
            next: (project) => {
                if (!project) {
                    this.clearUrl();
                    return;
                }

                // Set initial status based on project status
                if (project.status === 'completed') {
                    this.videoUrl.set(`${environment.apiUrl}/projects/${projectId}/final_video.mp4`);
                    this.processingStatus.set(VIDEO_CONSTANTS.STATUS.COMPLETED);
                } else if (project.status === 'draft_ready' || project.status === 'generating_video') { // Treat generating as preview mode so user can see progress/result eventually
                    // If it was generating, we might want to show spinner, but let's default to preview layout
                    // and let socket status update it if needed.
                    this.processingStatus.set(VIDEO_CONSTANTS.STATUS.PREVIEW);
                    this.projectData.set(project);
                    this.loadProjectPreview(projectId); // This sets up player etc
                } else if (project.status === 'processing' || project.status === 'pending') {
                    this.processingStatus.set(VIDEO_CONSTANTS.STATUS.PROCESSING);
                } else if (project.status === 'failed') {
                    this.errorMessage.set('VIDEO_GENERATION_FAILED');
                    // Maybe show input again but with error?
                }

                // Re-join socket
                this.socketService.joinProject(projectId);
                this.socketService.onProjectUpdate().subscribe((data) => {
                    this.handleProjectUpdate(data, projectId);
                });
            },
            error: () => this.clearUrl()
        });
    }

    updateUrl(projectId: string) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { id: projectId },
            queryParamsHandling: 'merge'
        });
    }

    clearUrl() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { id: null },
            queryParamsHandling: 'merge'
        });
    }

    ngOnDestroy() {
        this.playerService.cleanup();
    }

    handleScriptSubmit(script: string) {
        this.isSubmitting.set(true);
        this.errorMessage.set(null);

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
                    this.processingStatus.set(VIDEO_CONSTANTS.STATUS.PROCESSING);
                    this.updateUrl(response.projectId);

                    this.socketService.joinProject(response.projectId);

                    // Subscribe to updates
                    this.socketService.onProjectUpdate().subscribe((data) => {
                        this.handleProjectUpdate(data, response.projectId);
                    });

                    // Check initial status in case we missed the event
                    this.videoService.getProject(response.projectId).subscribe(project => {
                        if (project && project.status !== VIDEO_CONSTANTS.STATUS.PROCESSING && project.status !== 'pending') {
                            this.handleProjectUpdate(project, response.projectId);
                        }
                    });
                }
            });
    }

    private handleProjectUpdate(data: any, projectId: string) {
        console.log('Project update/status:', data);
        if (data.status === 'draft_ready') {
            this.loadProjectPreview(projectId);
        } else if (data.status === VIDEO_CONSTANTS.STATUS.COMPLETED && data.videoUrl) {
            this.videoUrl.set(`${environment.apiUrl}/projects/${projectId}/final_video.mp4`);
            this.processingStatus.set(VIDEO_CONSTANTS.STATUS.COMPLETED);
        } else if (data.status === 'failed') {
            this.errorMessage.set('VIDEO_GENERATION_FAILED');
            this.processingStatus.set(VIDEO_CONSTANTS.STATUS.INPUT);
        }
    }

    loadProjectPreview(projectId: string) {
        this.videoService.getProject(projectId).subscribe(project => {
            if (project) {
                this.projectData.set(project);
                if (project.subtitleSettings) {
                    const mergedSettings = { showSubtitles: true, ...project.subtitleSettings };
                    this.subtitleSettings.set(mergedSettings);
                }
                this.processingStatus.set(VIDEO_CONSTANTS.STATUS.PREVIEW);

                // Init audio player
                const audioUrl = `${environment.apiUrl}/projects/${projectId}/${project.audioPath.split('/').pop()}`;
                this.playerService.initializeAudio(audioUrl);

                // Init effects map
                this.segmentEffects = project.segments.map(() =>
                    Math.random() > 0.5 ? VIDEO_CONSTANTS.ANIMATIONS.ZOOM : VIDEO_CONSTANTS.ANIMATIONS.ORBITAL
                );

                // Init active image
                if (project.segments.length > 0) {
                    this.activeImage.set(this.getImageUrl(project.segments[0].imagePath));
                    this.currentEffect.set(this.segmentEffects[0]);
                    this.lastSegmentIndex = 0;
                }
            }
        });
    }

    regenerateImage(segmentIndex: number, newPrompt: string) {
        const id = this.projectId();
        if (!id) return;

        this.videoService.regenerateImage(id, segmentIndex, newPrompt).subscribe((updatedProject) => {
            if (updatedProject) {
                this.projectData.set(updatedProject);
            }
        });
    }

    uploadImage(segmentIndex: number, file: File) {
        const id = this.projectId();
        if (!id) return;

        this.videoService.uploadImage(id, segmentIndex, file).subscribe((updatedProject) => {
            if (updatedProject) {
                this.projectData.set(updatedProject);
                this.updateActiveImageIfCurrent(updatedProject, segmentIndex);
            }
        });
    }

    updateActiveImageIfCurrent(project: any, segmentIndex: number) {
        const duration = (project.audioDuration || VIDEO_CONSTANTS.DEFAULTS.AUDIO_DURATION);
        const segDuration = duration / project.segments.length;
        const currentIdx = Math.floor(this.playerService.currentTime() / segDuration);

        if (currentIdx === segmentIndex) {
            this.activeImage.set(this.getImageUrl(project.segments[segmentIndex].imagePath));
        }
    }

    updateSubtitle() {
        const id = this.projectId();
        if (id) {
            this.videoService.updateSubtitles(id, this.projectData().subtitles).subscribe();
        }
    }

    resetForm() {
        this.processingStatus.set(VIDEO_CONSTANTS.STATUS.INPUT);
        this.projectId.set(null);
        this.videoUrl.set(null);
        this.playerService.reset();
        this.clearUrl();
    }

    private getImageUrl(imagePath: string): string {
        if (!imagePath) return '';
        const filename = imagePath.split('/').pop();
        return `${environment.apiUrl}/projects/${this.projectId()}/${filename}?t=${new Date().getTime()}`;
    }

    private updatePreviewState(time: number) {
        const project = this.projectData();
        if (!project) return;

        // Find active segment/image
        const totalSegments = project.segments.length;
        const durationPerSegment = (project.audioDuration || VIDEO_CONSTANTS.DEFAULTS.AUDIO_DURATION) / totalSegments;
        const currentSegmentIndex = Math.min(Math.floor(time / durationPerSegment), totalSegments - 1);

        // Transition Logic
        if (currentSegmentIndex !== this.lastSegmentIndex) {
            const newImage = this.getImageUrl(project.segments[currentSegmentIndex]?.imagePath);

            if (this.lastSegmentIndex !== -1 && this.activeImage()) {
                // Start transition
                this.previousImage.set(this.activeImage());
                this.isTransitioning.set(true);

                // Clear transition
                setTimeout(() => {
                    this.isTransitioning.set(false);
                    this.previousImage.set(null);
                }, VIDEO_CONSTANTS.DEFAULTS.TRANSITION_DURATION_MS);
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

    finalizeVideo() {
        const id = this.projectId();
        if (!id) return;
        this.processingStatus.set(VIDEO_CONSTANTS.STATUS.GENERATING);
        this.videoService.renderVideo(id, { subtitleSettings: this.subtitleSettings() }).subscribe(() => {
            // Status will update via socket to 'completed'
        });
    }

    togglePlay() {
        this.playerService.togglePlay();
    }

    // Subtitle Editor Methods
    openSubtitleEditor() {
        this.subtitleEditorOpen.set(true);
    }

    closeSubtitleEditor() {
        this.subtitleEditorOpen.set(false);
    }

    updateSubtitleSettingsLocal(settings: any) {
        this.subtitleSettings.set(settings);
    }

    saveSubtitleSettings(settings: any) {
        const id = this.projectId();
        if (id) {
            this.videoService.updateSubtitleSettings(id, settings).subscribe(() => {
                this.subtitleSettings.set(settings);
                this.closeSubtitleEditor();
            });
        }
    }

    toggleSubtitles(show: boolean) {
        const currentSettings = this.subtitleSettings();
        const newSettings = { ...currentSettings, showSubtitles: show };

        // Optimistic update
        this.subtitleSettings.set(newSettings);

        const id = this.projectId();
        if (id) {
            this.videoService.updateSubtitleSettings(id, newSettings).subscribe({
                error: (err) => {
                    console.error('Failed to update subtitle settings', err);
                    // Revert on error
                    this.subtitleSettings.set(currentSettings);
                }
            });
        }
    }

    regenerateThumbnail(prompt?: string) {
        const id = this.projectId();
        if (!id) return;

        this.isThumbnailLoading.set(true);
        this.videoService.regenerateThumbnail(id, prompt)
            .pipe(finalize(() => this.isThumbnailLoading.set(false)))
            .subscribe(updatedProject => {
                if (updatedProject) {
                    this.projectData.set(updatedProject);
                }
            });
    }

    uploadThumbnail(file: File) {
        const id = this.projectId();
        if (!id) return;

        this.isThumbnailLoading.set(true);
        this.videoService.uploadThumbnail(id, file)
            .pipe(finalize(() => this.isThumbnailLoading.set(false)))
            .subscribe(updatedProject => {
                if (updatedProject) {
                    this.projectData.set(updatedProject);
                }
            });
    }
}
