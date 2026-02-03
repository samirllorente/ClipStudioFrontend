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

    initializeAudio(audioUrl: string) {
        if (this.audioElement) {
            this.audioElement.src = audioUrl;
            // Reset state if needed, though usually we want to keep it if just switching tracks? 
            // For this app, it's safer to reset.
            this.reset();
        } else {
            this.audioElement = new Audio(audioUrl);
            this.setupListeners();
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
        });

        // Error handling could be added here
    }

    togglePlay() {
        if (!this.audioElement) return;

        if (this.isPlaying()) {
            this.audioElement.pause();
            this.isPlaying.set(false);
        } else {
            this.audioElement.play().catch(e => console.error("Error playing audio:", e));
            this.isPlaying.set(true);
        }
    }

    reset() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
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
        this.isPlaying.set(false);
    }
}
