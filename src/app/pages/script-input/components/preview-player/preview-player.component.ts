import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-preview-player',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './preview-player.component.html',
    styleUrl: './preview-player.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewPlayerComponent {
    @Input() activeImage: string | null = null;
    @Input() previousImage: string | null = null;
    @Input() activeSubtitle: string = '';
    @Input() subtitleSettings: any = {};
    @Input() showSubtitles = true;
    @Input() isPlaying = false;
    @Input() currentEffect = 'animate-intense-zoom';
    @Input() aspectRatio = '9:16';

    @Output() togglePlay = new EventEmitter<void>();
    @Output() toggleSubtitles = new EventEmitter<boolean>();


}
