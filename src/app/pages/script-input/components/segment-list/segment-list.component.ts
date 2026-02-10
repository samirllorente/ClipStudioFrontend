import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { VIDEO_CONSTANTS } from '../../../../core/constants/video.constants';

@Component({
    selector: 'app-segment-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './segment-list.component.html',
    styleUrl: './segment-list.component.css'
})
export class SegmentListComponent {
    @Input() projectData: any;
    @Input() projectId: string | null = null;
    @Input() subtitleSettings: any = {};

    // @Output() openSubtitleEditor = new EventEmitter<void>(); // Moved to parent
    @Output() regenerateImage = new EventEmitter<{ index: number, prompt: string }>();
    @Output() uploadImage = new EventEmitter<{ index: number, file: File }>();
    @Output() updateSubtitle = new EventEmitter<void>();
    // @Output() toggleSubtitles = new EventEmitter<boolean>(); // Moved to parent

    predefinedColors = VIDEO_CONSTANTS.SUBTITLE_COLORS;

    /* onToggleSubtitles(event: any) {
        this.toggleSubtitles.emit(event.target.checked);
    } */

    getImageUrl(imagePath: string): string {
        if (!imagePath || !this.projectId) return '';
        const filename = imagePath.split('/').pop();
        return `${environment.apiUrl}/projects/${this.projectId}/${filename}?t=${new Date().getTime()}`;
    }

    getSegmentSubtitles(segmentIndex: number): any[] {
        if (!this.projectData) return [];
        const totalSegments = this.projectData.segments.length;
        const durationPerSegment = (this.projectData.audioDuration || VIDEO_CONSTANTS.DEFAULTS.AUDIO_DURATION) / totalSegments;
        const startTime = segmentIndex * durationPerSegment;
        const endTime = (segmentIndex + 1) * durationPerSegment;
        return this.projectData.subtitles.filter((s: any) => s.start >= startTime && s.start < endTime);
    }

    handleFileSelected(event: any, index: number) {
        const file = event.target.files[0];
        if (file) {
            this.uploadImage.emit({ index, file });
        }
    }

    regeneratingSegments = new Set<number>();

    handleRegenerate(index: number, prompt: string) {
        this.regeneratingSegments.add(index);
        this.regenerateImage.emit({ index, prompt });
    }

    isRegenerating(index: number): boolean {
        return this.regeneratingSegments.has(index);
    }

    // Reset loading state when project data updates (assuming regeneration brings new data)
    ngOnChanges() {
        // Simple heuristic: if we get new project data, clear loading states?
        // Or better, let's just clear specific index if we could track change.
        // For now, let's keep it simple: we clear "loading" for an index only if we detect the image path changed?
        // Actually, easiest valid UX for now: clear all on data change?
        // Or just rely on a timer? 
        // No, let's clear the set whenever projectData changes reference, as that implies a refresh.
        this.regeneratingSegments.clear();
    }

    handleSubtitleChange(sub: any, event: any) {
        sub.text = event.target.value;
        this.updateSubtitle.emit();
    }
}
