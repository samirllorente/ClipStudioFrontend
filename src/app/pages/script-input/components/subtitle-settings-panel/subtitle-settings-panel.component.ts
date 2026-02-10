import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-subtitle-settings-panel',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
      <div class="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 flex flex-wrap gap-4 justify-between items-center mb-6">
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
                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-md active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                 {{ 'OPEN_EDITOR' | translate }}
              </button>
          </div>
      </div>
    `
})
export class SubtitleSettingsPanelComponent {
    @Input() subtitleSettings: any = {};
    @Output() openSubtitleEditor = new EventEmitter<void>();
    @Output() toggleSubtitles = new EventEmitter<boolean>();

    onToggleSubtitles(event: any) {
        this.toggleSubtitles.emit(event.target.checked);
    }
}
