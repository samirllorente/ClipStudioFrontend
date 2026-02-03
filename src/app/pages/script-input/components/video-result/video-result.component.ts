import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-video-result',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex flex-col items-center w-full">
      <video *ngIf="videoUrl" controls autoplay class="w-full max-h-[80vh] rounded-xl shadow-lg border border-slate-700">
        <source [src]="videoUrl" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="flex gap-4 mt-6 justify-center w-full">
        <a [href]="videoUrl" (click)="downloadVideo($event)"
            class="h-12 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-lg text-white font-bold shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer no-underline min-w-[160px]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m0 0l-3-3m3 3l3-3" />
            </svg>
            {{ 'DOWNLOAD_VIDEO' | translate }}
        </a>
        <button (click)="onBack.emit()"
            class="h-12 px-6 bg-slate-700 hover:bg-slate-600 hover:shadow-lg active:scale-95 rounded-lg text-white font-bold transition-all cursor-pointer flex items-center justify-center min-w-[160px]">
            {{ 'BACK_BUTTON' | translate }}
        </button>
      </div>
    </div>
  `
})
export class VideoResultComponent {
  @Input() videoUrl: string | null = null;
  @Output() onBack = new EventEmitter<void>();

  async downloadVideo(event: Event) {
    event.preventDefault();
    if (!this.videoUrl) return;

    try {
      const response = await fetch(this.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `clip_studio_${new Date().getTime()}.mp4`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: just open in new tab if blob fetch fails (e.g. CORS issues)
      window.open(this.videoUrl, '_blank');
    }
  }
}
