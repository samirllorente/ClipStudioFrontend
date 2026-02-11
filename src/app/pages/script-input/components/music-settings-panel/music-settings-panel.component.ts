import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-music-settings-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './music-settings-panel.component.html',
    styleUrl: './music-settings-panel.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
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


    updateVolume(type: 'voice' | 'music') {
        if (type === 'voice') {
            this.emitChange({ voiceVolume: this.localVoiceVolume });
        } else {
            this.emitChange({ voiceVolume: this.localVoiceVolume, musicVolume: this.localMusicVolume });
        }
    }

    updateFade(type: 'fadeIn' | 'fadeOut') {
        if (type === 'fadeIn') {
            this.emitChange({ musicFadeIn: this.localMusicFadeIn });
        } else {
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
