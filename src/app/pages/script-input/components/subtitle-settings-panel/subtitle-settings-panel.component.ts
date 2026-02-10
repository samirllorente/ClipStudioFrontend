import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-subtitle-settings-panel',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './subtitle-settings-panel.component.html',
  styleUrl: './subtitle-settings-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubtitleSettingsPanelComponent {
  @Input() subtitleSettings: any = {};
  @Output() openSubtitleEditor = new EventEmitter<void>();
  @Output() toggleSubtitles = new EventEmitter<boolean>();

  onToggleSubtitles(event: any) {
    this.toggleSubtitles.emit(event.target.checked);
  }
}
