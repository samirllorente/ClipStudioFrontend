import { Component, EventEmitter, Input, Output } from '@angular/core';
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
      <div class="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">{{ 'SUBTITLE_SETTINGS' | translate }}</h3>
          <div class="flex flex-wrap items-center gap-6">
              <div class="flex flex-col gap-2">
                  <label class="text-xs text-slate-400 uppercase font-bold">{{ 'TEXT_COLOR' | translate }}</label>
                  <div class="flex items-center gap-3">
                      <!-- Presets -->
                      @for(color of predefinedColors; track color) {
                          <button (click)="subtitleColorChange.emit(color)"
                              class="w-8 h-8 rounded-full border-2 border-slate-600 hover:scale-110 transition-transform cursor-pointer"
                              [style.background-color]="color"
                              [class.ring-2]="subtitleColor === color"
                              [class.ring-indigo-500]="subtitleColor === color"></button>
                      }

                      <!-- Custom Hex -->
                      <div class="relative ml-4 flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                          <span class="text-slate-400 pl-2">#</span>
                          <input type="text" [ngModel]="subtitleColor.replace('#','')"
                              (ngModelChange)="subtitleColorChange.emit('#' + $event)"
                              class="w-20 bg-transparent text-white p-1 outline-none uppercase font-mono"
                              maxlength="6">
                          <input type="color" [ngModel]="subtitleColor"
                              (ngModelChange)="subtitleColorChange.emit($event)"
                              class="w-8 h-8 rounded cursor-pointer border-0 p-0 ml-2">
                      </div>
                  </div>
              </div>
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
                      <button (click)="regenerateImage.emit({index: i, prompt: segment.prompt})"
                          class="flex-1 text-xs bg-slate-700 hover:bg-slate-600 hover:shadow-md active:scale-95 py-2 rounded text-white transition-all cursor-pointer">
                          {{ 'REGENERATE_IMAGE' | translate }}
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
              <h3 class="text-lg font-semibold text-white">Subtitles</h3>
              <div class="grid grid-cols-1 gap-1">
                  @for (sub of getSegmentSubtitles(i); track $index) {
                  <div class="flex gap-4 items-center p-2 rounded hover:bg-slate-800/50 transition-colors group">
                      <span class="text-xs font-mono text-slate-500 w-16 text-right select-none">
                          {{ (sub.start | number:'1.2-2') }}s
                      </span>
                      <!-- Clean input without borders, looking like text -->
                      <input type="text" [value]="sub.text" (change)="handleSubtitleChange(sub, $event)"
                          [style.color]="subtitleColor"
                          class="flex-1 bg-transparent text-lg font-medium outline-none border-none focus:ring-0 placeholder-slate-600">
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
    @Input() subtitleColor: string = VIDEO_CONSTANTS.DEFAULT_SUBTITLE_COLOR;

    @Output() subtitleColorChange = new EventEmitter<string>();
    @Output() regenerateImage = new EventEmitter<{ index: number, prompt: string }>();
    @Output() uploadImage = new EventEmitter<{ index: number, file: File }>();
    @Output() updateSubtitle = new EventEmitter<void>();

    predefinedColors = VIDEO_CONSTANTS.SUBTITLE_COLORS;

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

    handleSubtitleChange(sub: any, event: any) {
        sub.text = event.target.value;
        this.updateSubtitle.emit();
    }
}
