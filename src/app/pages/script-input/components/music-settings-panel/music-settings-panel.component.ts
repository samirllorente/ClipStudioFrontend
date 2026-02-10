import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-music-settings-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
      <div class="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-6 mb-6">
          
          <!-- Header & Toggle -->
          <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-white">{{ 'AUDIO_TAB' | translate }}</h3>
                <p class="text-slate-400 text-sm mt-1">{{ 'MUSIC_SETTINGS_DESC' | translate }}</p>
              </div>
              
              <label class="inline-flex items-center cursor-pointer">
                  <span class="mr-3 text-sm font-medium text-white">{{ 'ENABLE_MUSIC' | translate }}</span>
                  <div class="relative">
                      <input type="checkbox" [checked]="musicSettings?.enableMusic" (change)="toggleMusic($event)" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
              </label>
          </div>

          <div *ngIf="musicSettings?.enableMusic" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              
              <!-- Volume Controls -->
              <div class="space-y-4">
                  <!-- Voice Volume -->
                  <div class="space-y-2">
                      <div class="flex justify-between">
                          <label class="text-xs text-slate-400 uppercase font-bold tracking-wider">{{ 'VOICE_VOLUME' | translate }}</label>
                          <span class="text-xs text-white font-mono">{{ musicSettings.voiceVolume }}%</span>
                      </div>
                      <input type="range" min="0" max="100" [(ngModel)]="localVoiceVolume" (ngModelChange)="updateVolume('voice')"
                             class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500">
                  </div>

                  <!-- Music Volume -->
                  <div class="space-y-2">
                      <div class="flex justify-between">
                          <label class="text-xs text-slate-400 uppercase font-bold tracking-wider">{{ 'MUSIC_VOLUME' | translate }}</label>
                          <span class="text-xs text-white font-mono">{{ musicSettings.musicVolume }}%</span>
                      </div>
                      <input type="range" min="0" max="100" [(ngModel)]="localMusicVolume" (ngModelChange)="updateVolume('music')"
                             class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500">
                  </div>

                  <!-- Fade Controls -->
                  <div class="grid grid-cols-2 gap-4 pt-2">
                      <div class="space-y-2">
                          <div class="flex justify-between">
                              <label class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{{ 'FADE_IN' | translate }}</label>
                              <span class="text-[10px] text-white font-mono">{{ localMusicFadeIn.toFixed(1) }}s</span>
                          </div>
                          <input type="range" min="0" max="10" step="0.1" [(ngModel)]="localMusicFadeIn" (ngModelChange)="updateFade('fadeIn')"
                                 class="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400">
                      </div>
                      <div class="space-y-2">
                          <div class="flex justify-between">
                              <label class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{{ 'FADE_OUT' | translate }}</label>
                              <span class="text-[10px] text-white font-mono">{{ localMusicFadeOut.toFixed(1) }}s</span>
                          </div>
                          <input type="range" min="0" max="10" step="0.1" [(ngModel)]="localMusicFadeOut" (ngModelChange)="updateFade('fadeOut')"
                                 class="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400">
                      </div>
                  </div>
              </div>

              <!-- Selection & List -->
              <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <label class="text-xs text-slate-400 uppercase font-bold tracking-wider">{{ 'BACKGROUND_MUSIC' | translate }}</label>
                    <button (click)="fileInput.click()" 
                            class="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                            [title]="'UPLOAD_MUSIC' | translate">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        {{ 'UPLOAD' | translate }}
                        <input #fileInput type="file" accept="audio/mp3,audio/*" class="hidden" (change)="onUpload($event)">
                    </button>
                  </div>
                  
                  <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col max-h-64">
                      <!-- Custom Music Item (only if active) -->
                      <div *ngIf="musicSettings.musicSource === 'custom'" 
                           class="p-3 border-b border-slate-700 bg-indigo-900/30 text-indigo-200 text-sm flex justify-between items-center">
                          <span class="flex items-center gap-2">
                              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                              {{ 'CUSTOM_MUSIC_ACTIVE' | translate }}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                      </div>

                      <!-- List Container -->
                       <!-- List Container -->
                       <div class="overflow-y-auto custom-scrollbar">
                            <!-- No Music Option -->
                            <div (click)="onMusicSelect(null)"
                                 class="p-3 hover:bg-slate-700/50 cursor-pointer transition-colors text-sm flex justify-between items-center group"
                                 [class.bg-slate-700]="musicSettings.backgroundMusicId === null && musicSettings.musicSource !== 'custom'"
                                 [class.text-white]="musicSettings.backgroundMusicId === null && musicSettings.musicSource !== 'custom'"
                                 [class.text-slate-400]="musicSettings.backgroundMusicId !== null || musicSettings.musicSource === 'custom'">
                                 <span>{{ 'NO_MUSIC' | translate }}</span>
                                 <span *ngIf="musicSettings.backgroundMusicId === null && musicSettings.musicSource !== 'custom'" class="text-indigo-400">
                                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                 </span>
                            </div>

                            <!-- Music List -->
                            <div *ngFor="let music of musicList" 
                                 (click)="onMusicSelect(music._id)"
                                 class="p-3 hover:bg-slate-700/50 transition-colors text-sm flex justify-between items-center border-t border-slate-700/50 group cursor-pointer"
                                 [class.bg-slate-700]="musicSettings.backgroundMusicId === music._id && musicSettings.musicSource === 'library'"
                                 [class.text-white]="musicSettings.backgroundMusicId === music._id && musicSettings.musicSource === 'library'"
                                 [class.text-slate-400]="musicSettings.backgroundMusicId !== music._id || musicSettings.musicSource !== 'library'">
                                 
                                 <!-- Info -->
                                 <div class="flex-1 min-w-0 pr-4">
                                     <div class="font-medium truncate" [title]="music.name">{{ music.name }}</div>
                                     <div class="text-xs opacity-70 truncate" [title]="music.artist">{{ music.artist }}</div>
                                 </div>

                                 <!-- Actions: Preview & Status -->
                                 <div class="flex items-center gap-3 shrink-0">
                                     <span class="text-xs opacity-50 whitespace-nowrap font-mono">{{ formatDuration(music.duration) }}</span>
                                     
                                     <!-- Preview Button -->
                                     <button (click)="togglePreview(music, $event)" 
                                             class="p-2 rounded-full hover:bg-slate-600/50 text-indigo-400 hover:text-indigo-300 transition-all transform hover:scale-110 focus:outline-none cursor-pointer"
                                             [title]="(previewingId === music._id ? 'PAUSE_PREVIEW' : 'PLAY_PREVIEW') | translate">
                                         <svg *ngIf="previewingId !== music._id" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                             <path d="M8 5v14l11-7z" />
                                         </svg>
                                          <svg *ngIf="previewingId === music._id" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                             <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                          </svg>
                                     </button>

                                     <!-- Selected Indicator -->
                                     <span *ngIf="musicSettings.backgroundMusicId === music._id && musicSettings.musicSource === 'library'" class="text-indigo-400 w-4 flex justify-center">
                                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                     </span>
                                     <span *ngIf="!(musicSettings.backgroundMusicId === music._id && musicSettings.musicSource === 'library')" class="w-4"></span>
                                 </div>
                            </div>
                       </div>
                  </div>
              </div>
          </div>
      </div>
    `,
    styles: [`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(30, 41, 59, 0.5); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.8); 
            border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.5); 
        }
    `]
})
export class MusicSettingsPanelComponent implements OnChanges {
    @Input() musicSettings: any = {};
    @Input() musicList: any[] = [];
    @Output() musicSettingsChange = new EventEmitter<any>();
    @Output() uploadMusic = new EventEmitter<File>();

    localVoiceVolume: number = 100;
    localMusicVolume: number = 15;
    localMusicFadeIn: number = 0;
    localMusicFadeOut: number = 0;

    // Preview State
    previewingId: string | null = null;
    private previewAudio: HTMLAudioElement | null = null;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['musicSettings'] && this.musicSettings) {
            this.localVoiceVolume = this.musicSettings.voiceVolume ?? 100;
            this.localMusicVolume = this.musicSettings.musicVolume ?? 15;
            this.localMusicFadeIn = this.musicSettings.musicFadeIn ?? 0;
            this.localMusicFadeOut = this.musicSettings.musicFadeOut ?? 0;
        }
    }

    toggleMusic(event: any) {
        this.musicSettings.enableMusic = event.target.checked;
        this.emitChange({ enableMusic: event.target.checked });
    }

    updateVolume(type: 'voice' | 'music') {
        if (type === 'voice') {
            this.musicSettings.voiceVolume = this.localVoiceVolume;
            this.emitChange({ voiceVolume: this.localVoiceVolume });
        } else {
            this.musicSettings.musicVolume = this.localMusicVolume;
            this.emitChange({ musicVolume: this.localMusicVolume });
        }
    }

    updateFade(type: 'fadeIn' | 'fadeOut') {
        if (type === 'fadeIn') {
            this.musicSettings.musicFadeIn = this.localMusicFadeIn;
            this.emitChange({ musicFadeIn: this.localMusicFadeIn });
        } else {
            this.musicSettings.musicFadeOut = this.localMusicFadeOut;
            this.emitChange({ musicFadeOut: this.localMusicFadeOut });
        }
    }

    onMusicSelect(id: any) {
        // If selecting from list, source becomes library
        this.emitChange({
            backgroundMusicId: id,
            musicSource: 'library'
        });
    }

    onUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.uploadMusic.emit(input.files[0]);
        }
        input.value = '';
    }

    private emitChange(changes: any) {
        this.musicSettingsChange.emit({
            ...this.musicSettings,
            ...changes
        });
    }

    formatDuration(seconds: number): string {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    togglePreview(music: any, event: Event) {
        event.stopPropagation(); // Prevent selection when clicking preview

        if (this.previewingId === music._id) {
            // Stop
            this.stopPreview();
        } else {
            // Play new
            this.stopPreview();
            this.previewingId = music._id;
            const url = `${environment.apiUrl}/music/${music._id}/stream`;
            this.previewAudio = new Audio(url);
            this.previewAudio.volume = (this.localMusicVolume || 15) / 100;
            this.previewAudio.onended = () => {
                this.previewingId = null;
            };
            this.previewAudio.play().catch(console.error);
        }
    }

    private stopPreview() {
        if (this.previewAudio) {
            this.previewAudio.pause();
            this.previewAudio = null;
        }
        this.previewingId = null;
    }
}
