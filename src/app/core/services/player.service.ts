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
    bgVolume = signal(0.15); // Default 15%

    initializeAudio(voiceUrl: string, musicUrl?: string | null, voiceVolume: number = 100, musicVolume: number = 15) {
        // Voice Audio
        if (this.audioElement) {
            this.audioElement.src = voiceUrl;
            this.audioElement.volume = voiceVolume / 100;
        } else {
            this.audioElement = new Audio(voiceUrl);
            this.audioElement.volume = voiceVolume / 100;
            this.setupListeners();
        }

        // Background Music
        this.initBackgroundMusic(musicUrl, musicVolume);

        // Reset state
        this.reset();
    }

    initBackgroundMusic(musicUrl: string | null | undefined, volume: number) {
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
            this.bgAudioElement.volume = volume / 100;
        } else {
            this.bgAudioElement = new Audio(musicUrl);
            this.bgAudioElement.loop = true; // Loop background music
            this.bgAudioElement.volume = volume / 100;
            if (this.isPlaying()) {
                this.bgAudioElement.play().catch(e => console.error("Error playing BG:", e));
            }
        }
    }

    updateVolumes(voiceVolume: number, musicVolume: number) {
        if (this.audioElement) {
            this.audioElement.volume = voiceVolume / 100;
        }
        if (this.bgAudioElement) {
            this.bgAudioElement.volume = musicVolume / 100;
        }
    }

    private setupListeners() {
        if (!this.audioElement) return;

        this.audioElement.addEventListener('timeupdate', () => {
            this.currentTime.set(this.audioElement!.currentTime);
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
