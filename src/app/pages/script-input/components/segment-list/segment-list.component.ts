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
    template: `
    <div class="space-y-8">
      <!-- Subtitle Settings -->
      <div class="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-white">{{ 'SUBTITLE_SETTINGS' | translate }}</h3>
            <p class="text-slate-400 text-sm mt-1">{{ 'SUBTITLE_SETTINGS_DESC' | translate }}</p>
          </div>
          
          <div class="flex items-center gap-4">
              <!-- Show/Hide Subtitles Toggle -->
              <label class="inline-flex items-center cursor-pointer">
                  <span class="mr-3 text-sm font-medium text-white">{{ 'SHOW_SUBTITLES' | translate }}</span>
                  <div class="relative">
                      <input type="checkbox" [checked]="subtitleSettings?.showSubtitles" (change)="onToggleSubtitles($event)" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
              </label>

              <button (click)="openSubtitleEditor.emit()"
                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                 {{ 'OPEN_EDITOR' | translate }}
              </button>
          </div>
      </div>

      @for (segment of projectData.segments; track segment.id; let i = $index) {
      <div class="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row gap-6">
          <!-- Image Column -->
          <div class="w-full md:w-2/5 flex flex-col gap-4">
              <div class="relative aspect-[9/16] bg-black/50 rounded-xl overflow-hidden border border-slate-700">
                  <img [src]="getImageUrl(segment.imagePath)" class="w-full h-full object-cover">
              </div>
              <div class="flex flex-col gap-2">
                  <label class="text-xs text-slate-400 uppercase tracking-wider font-bold">PROMPT</label>
                  <textarea rows="3" [(ngModel)]="segment.prompt" [ngModelOptions]="{standalone: true}"
                      class="w-full bg-slate-800 rounded-lg p-3 text-sm text-slate-200 border border-slate-700 focus:border-indigo-500 outline-none resize-none"></textarea>
                  <div class="flex gap-2">
                      <button (click)="handleRegenerate(i, segment.prompt)" [disabled]="isRegenerating(i)"
                          class="flex-1 text-xs bg-slate-700 hover:bg-slate-600 hover:shadow-md active:scale-95 py-2 rounded text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                          @if(isRegenerating(i)) {
                              <div class="animate-spin h-3 w-3 border-2 border-white rounded-full border-t-transparent"></div>
                          }
                          {{ (isRegenerating(i) ? 'PROCESSING' : 'REGENERATE_IMAGE') | translate }}
                      </button>
                      <button (click)="fileInput.click()"
                          class="flex-none px-3 text-xs bg-indigo-600 hover:bg-indigo-500 hover:shadow-md hover:scale-110 active:scale-90 py-2 rounded text-white transition-all flex items-center justify-center cursor-pointer"
                          title="{{ 'UPLOAD_IMAGE' | translate }}">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                              stroke-width="2" stroke="currentColor" class="w-4 h-4">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                      </button>
                      <input #fileInput type="file" class="hidden" (change)="handleFileSelected($event, i)"
                          accept="image/*">
                  </div>
              </div>
          </div>

          <!-- Subtitles Column -->
          <div class="w-full md:w-3/5 flex flex-col gap-4">
              <h3 class="text-lg font-semibold text-white">{{ 'SUBTITLES_HEADER' | translate }}</h3>
              <div class="grid grid-cols-1 gap-1">
                  @for (sub of getSegmentSubtitles(i); track $index) {
                  <div class="flex gap-4 items-center p-2 rounded hover:bg-slate-800/50 transition-colors group">
                      <span class="text-xs font-mono text-slate-500 w-16 text-right select-none">
                          {{ (sub.start | number:'1.2-2') }}s
                      </span>
                      <!-- Clean input without borders, looking like text -->
                      <input type="text" [value]="sub.text" (change)="handleSubtitleChange(sub, $event)"
                          class="flex-1 bg-transparent font-medium border-b border-transparent focus:border-slate-600 outline-none text-slate-200 transition-all font-sans text-base">
                  </div>
                  }
              </div>
          </div>
      </div>
      }
    </div>
  `
})
export class SegmentListComponent {
    @Input() projectData: any;
    @Input() projectId: string | null = null;
    @Input() subtitleSettings: any = {};

    @Output() openSubtitleEditor = new EventEmitter<void>();
    @Output() regenerateImage = new EventEmitter<{ index: number, prompt: string }>();
    @Output() uploadImage = new EventEmitter<{ index: number, file: File }>();
    @Output() updateSubtitle = new EventEmitter<void>();
    @Output() toggleSubtitles = new EventEmitter<boolean>();

    predefinedColors = VIDEO_CONSTANTS.SUBTITLE_COLORS;

    onToggleSubtitles(event: any) {
        this.toggleSubtitles.emit(event.target.checked);
    }

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
