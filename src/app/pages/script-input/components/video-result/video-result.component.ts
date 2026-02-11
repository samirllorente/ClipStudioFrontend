import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-video-result',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './video-result.component.html',
  styleUrl: './video-result.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoResultComponent {
  @Input() videoUrl: string | null = null;
  @Input() aspectRatio: string = '9:16';
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
