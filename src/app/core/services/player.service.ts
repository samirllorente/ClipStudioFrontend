import { Injectable, signal, computed } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    // State
    private audioElement: HTMLAudioElement | null = null;

    isPlaying = signal(false);
    currentTime = signal(0);

    // Computed helpers could go here if we had access to the project data in the service,
    // but for now, we'll keep the core "engine" logic here.

    // Background Music State
    private bgAudioElement: HTMLAudioElement | null = null;
    private baseMusicVolume: number = 0.15;
    private fadeIn: number = 0;
    private fadeOut: number = 0;
    private totalDuration: number = 0;

    initializeAudio(voiceUrl: string, musicUrl: string | null | undefined, settings: { voiceVolume: number, musicVolume: number, fadeIn: number, fadeOut: number, duration: number }) {
        // Voice Audio
        if (this.audioElement) {
            this.audioElement.src = voiceUrl;
            this.audioElement.volume = settings.voiceVolume / 100;
        } else {
            this.audioElement = new Audio(voiceUrl);
            this.audioElement.volume = settings.voiceVolume / 100;
            this.setupListeners();
        }

        // Fades
        this.fadeIn = settings.fadeIn;
        this.fadeOut = settings.fadeOut;
        this.totalDuration = settings.duration;
        this.baseMusicVolume = settings.musicVolume / 100;

        // Background Music
        this.initBackgroundMusic(musicUrl, settings.musicVolume);

        // Reset state
        this.reset();
    }

    initBackgroundMusic(musicUrl: string | null | undefined, volume: number) {
        this.baseMusicVolume = volume / 100;

        if (!musicUrl) {
            if (this.bgAudioElement) {
                this.bgAudioElement.pause();
                this.bgAudioElement = null;
            }
            return;
        }

        if (this.bgAudioElement) {
            // Only update src if changed
            if (this.bgAudioElement.src !== musicUrl) {
                this.bgAudioElement.src = musicUrl;
                this.bgAudioElement.load();
                if (this.isPlaying()) {
                    this.bgAudioElement.play().catch(e => console.error("Error playing BG:", e));
                }
            }
            this.applyFades(this.audioElement ? this.audioElement.currentTime : 0);
        } else {
            this.bgAudioElement = new Audio(musicUrl);
            this.bgAudioElement.loop = true; // Loop background music
            this.applyFades(this.audioElement ? this.audioElement.currentTime : 0);
            if (this.isPlaying()) {
                this.bgAudioElement.play().catch(e => console.error("Error playing BG:", e));
            }
        }
    }

    updateFadeSettings(settings: { fadeIn: number, fadeOut: number, duration: number }) {
        this.fadeIn = settings.fadeIn;
        this.fadeOut = settings.fadeOut;
        this.totalDuration = settings.duration;
        this.applyFades(this.audioElement ? this.audioElement.currentTime : 0);
    }

    updateVolumes(voiceVolume: number, musicVolume: number) {
        this.baseMusicVolume = musicVolume / 100;
        if (this.audioElement) {
            this.audioElement.volume = voiceVolume / 100;
        }
        this.applyFades(this.audioElement ? this.audioElement.currentTime : 0);
    }

    private applyFades(time: number) {
        if (!this.bgAudioElement) return;

        let multiplier = 1;

        // Fade In
        if (this.fadeIn > 0 && time < this.fadeIn) {
            multiplier = time / this.fadeIn;
        }
        // Fade Out
        else if (this.fadeOut > 0 && this.totalDuration > 0 && time > (this.totalDuration - this.fadeOut)) {
            const fadeOutStart = this.totalDuration - this.fadeOut;
            multiplier = 1 - ((time - fadeOutStart) / this.fadeOut);
        }

        multiplier = Math.max(0, Math.min(1, multiplier));
        this.bgAudioElement.volume = this.baseMusicVolume * multiplier;
    }

    private setupListeners() {
        if (!this.audioElement) return;

        this.audioElement.addEventListener('timeupdate', () => {
            const time = this.audioElement!.currentTime;
            this.currentTime.set(time);
            this.applyFades(time);
        });

        this.audioElement.addEventListener('ended', () => {
            this.isPlaying.set(false);
            this.currentTime.set(0);
            if (this.bgAudioElement) {
                this.bgAudioElement.pause();
                this.bgAudioElement.currentTime = 0;
            }
        });

        this.audioElement.addEventListener('play', () => {
            if (this.bgAudioElement) this.bgAudioElement.play().catch(e => console.error("Error playing BG:", e));
            this.isPlaying.set(true);
        });

        this.audioElement.addEventListener('pause', () => {
            if (this.bgAudioElement) this.bgAudioElement.pause();
            this.isPlaying.set(false);
        });
    }

    togglePlay() {
        if (!this.audioElement) return;

        if (this.isPlaying()) {
            this.audioElement.pause();
            // Listener handles BG pause and state update
        } else {
            this.audioElement.play().catch(e => console.error("Error playing audio:", e));
            // Listener handles BG play and state update
        }
    }

    seek(time: number) {
        if (this.audioElement) {
            this.audioElement.currentTime = time;
            if (this.bgAudioElement) {
                // Optionally sync BG music or just let it loop? 
                // Usually BG music just loops, but strictly speaking if we seek, 
                // we might want to seek BG too? Or just let it play. 
                // Simple loop is usually enough for "background".
            }
        }
    }

    reset() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        if (this.bgAudioElement) {
            this.bgAudioElement.pause();
            this.bgAudioElement.currentTime = 0;
        }
        this.isPlaying.set(false);
        this.currentTime.set(0);
    }

    cleanup() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
            this.audioElement = null;
        }
        if (this.bgAudioElement) {
            this.bgAudioElement.pause();
            this.bgAudioElement.src = '';
            this.bgAudioElement = null;
        }
        this.isPlaying.set(false);
    }
}
