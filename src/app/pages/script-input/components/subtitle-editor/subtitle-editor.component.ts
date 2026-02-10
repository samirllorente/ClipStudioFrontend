import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { VIDEO_CONSTANTS } from '../../../../core/constants/video.constants';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-subtitle-editor',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './subtitle-editor.component.html',
    styleUrl: './subtitle-editor.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubtitleEditorComponent implements OnChanges, OnDestroy {
    @Input() isOpen = false;
    @Input() settings: any = {};
    @Output() close = new EventEmitter<void>();
    @Output() settingsChange = new EventEmitter<any>(); // Live preview emission
    @Output() saveSettings = new EventEmitter<any>();   // Persistence emission

    localSettings: any = {
        fontSize: 30,
        fontFamily: 'Permanent Marker',
        color: '#F4D03F',
        yPosition: 50,
        letterSpacing: 0
    };

    localMusicSettings: any = {
        backgroundMusicId: null,
        musicVolume: 20,
        voiceVolume: 100,
        enableMusic: true,
        musicSource: 'library' // or 'custom'
    };

    @Input() musicList: any[] = [];
    @Input() musicSettings: any = {};
    @Output() musicSettingsChange = new EventEmitter<any>();
    @Output() uploadMusic = new EventEmitter<File>();

    activeTab: 'subtitles' | 'audio' = 'subtitles';

    // Preview Audio
    previewAudio = new Audio();
    previewingMusicId: string | null = null;
    isPreviewPlaying = false;

    fullPreviewText = "Esta es una prueba de todo lo que puede lograr con ClipStudio";
    words: string[] = [];
    currentWord = "";
    private intervalId: any;
    private wordIndex = 0;

    constructor(private cdr: ChangeDetectorRef) {
        this.words = this.fullPreviewText.split(" ");
        this.currentWord = this.words[0];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['settings'] && this.settings) {
            this.localSettings = { ...this.localSettings, ...this.settings };
        }
        if (changes['musicSettings'] && this.musicSettings) {
            this.localMusicSettings = {
                backgroundMusicId: null,
                musicVolume: 20,
                voiceVolume: 100,
                enableMusic: true,
                musicSource: 'library',
                ...this.musicSettings
            };
        }
        if (changes['isOpen']) {
            if (this.isOpen) {
                this.startPreviewLoop();
            } else {
                this.stopPreviewLoop();
            }
        }
    }

    ngOnDestroy() {
        this.stopPreviewLoop();
        this.stopAudioPreview();
    }

    // Audio Preview Logic
    stopAudioPreview() {
        this.previewAudio.pause();
        this.previewAudio.currentTime = 0;
        this.isPreviewPlaying = false;
        this.previewingMusicId = null;
    }

    togglePreview(music: any, event: Event) {
        event.stopPropagation();

        if (this.previewingMusicId === music._id) {
            if (this.isPreviewPlaying) {
                this.previewAudio.pause();
                this.isPreviewPlaying = false;
            } else {
                this.previewAudio.play().catch(e => console.error(e));
                this.isPreviewPlaying = true;
            }
        } else {
            this.stopAudioPreview();
            this.previewingMusicId = music._id;
            this.previewAudio.src = `${location.origin}/api/music/${music._id}/stream`; // Assuming proxy or absolute URL needed?
            // Since environment.apiUrl is usually like http://localhost:3000, we might need to construct it properly
            // Ideally use VideoService or environment, but here I'll try relative if proxy exists, or construct full url.
            // Let's assume standard behavior. I don't have environment here easily without inject, but I can use inputs.
            // Actually, I should use absolute URL if backend is on different port.
            // Let's assume backend is at localhost:3000 for dev.
            // A cleaner way is to pass the base URL or construct it.
            // Hack for now: existing image URLs used environment.apiUrl.
            // I'll assume /api/ is proxied or I need full URL.
            // Let's try to infer from music object if it has a url, or construct it.
            // If music object doesn't have url, I'll use a hardcoded assumption or passed-in config.
            // But wait, I'm in a component. I can't easily access environment unless I import it.
            this.previewAudio.src = `${environment.apiUrl}/music/${music._id}/stream`;

            this.previewAudio.load();
            this.previewAudio.play().catch(e => console.error(e));
            this.isPreviewPlaying = true;

            this.previewAudio.onended = () => {
                this.isPreviewPlaying = false;
                this.cdr.detectChanges();
            };
        }
    }

    updateMusicSettings() {
        this.musicSettingsChange.emit(this.localMusicSettings);
    }

    toggleMusicEnabled() {
        this.localMusicSettings.enableMusic = !this.localMusicSettings.enableMusic;
        this.updateMusicSettings();
    }

    selectMusic(id: string | null) {
        this.localMusicSettings.backgroundMusicId = id;
        this.localMusicSettings.musicSource = 'library'; // switch to library source logic
        this.updateMusicSettings();
    }

    handleUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.uploadMusic.emit(input.files[0]);
        }
        input.value = '';
    }

    startPreviewLoop() {
        this.stopPreviewLoop();
        this.intervalId = setInterval(() => {
            this.currentWord = this.words[this.wordIndex];
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            this.cdr.detectChanges(); // Force update since parent is OnPush
        }, 500);
    }

    stopPreviewLoop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    availableFonts = [
        'Permanent Marker',
        'Bagel Fat One',
        'Bangers',
        'Chicle',
        'Condiment',
        'Italianno',
        'Pacifico',
        'Pirata One',
        'Roboto',
        'Poppins'
    ];

    predefinedColors = VIDEO_CONSTANTS.SUBTITLE_COLORS;

    fontsDropdownOpen = false;

    updateSettings() {
        this.settingsChange.emit(this.localSettings);
    }

    toggleFontDropdown() {
        this.fontsDropdownOpen = !this.fontsDropdownOpen;
    }

    selectFont(font: string) {
        this.localSettings.fontFamily = font;
        this.updateSettings();
        this.fontsDropdownOpen = false;
    }

    setColor(color: string) {
        this.localSettings.color = color;
        this.updateSettings();
    }

    resetSettings() {
        this.localSettings = {
            fontSize: 30,
            fontFamily: 'Permanent Marker',
            color: '#F4D03F', // Default Yellow
            yPosition: 50,
            letterSpacing: 0,
            showSubtitles: this.localSettings.showSubtitles ?? true
        };
        this.updateSettings();
    }
}
