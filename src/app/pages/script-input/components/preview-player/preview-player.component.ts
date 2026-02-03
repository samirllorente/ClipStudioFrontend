import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-preview-player',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="flex justify-center mb-12">
      <div class="relative w-[360px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">

        <!-- Layer 1: Previous Image (during transition) -->
        @if (previousImage) {
        <div class="absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out opacity-0">
            <img [src]="previousImage" class="w-full h-full object-cover">
        </div>
        }

        <!-- Layer 0: Active Image -->
        <div class="absolute inset-0 z-0">
            <img [src]="activeImage" class="w-full h-full object-cover transform origin-center"
                [ngClass]="currentEffect"
                [style.animation-play-state]="isPlaying ? 'running' : 'paused'">
        </div>

        <!-- Subtitle Overlay -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-6 text-center">
            <p class="text-3xl md:text-4xl font-bold font-permanent-marker drop-shadow-xl leading-tight"
                [style.color]="subtitleColor"
                style="-webkit-text-stroke: 1.2px black; text-shadow: 2px 2px 0 #000;">
                {{ activeSubtitle }}
            </p>
        </div>

        <!-- Controls Overlay -->
        <div class="absolute inset-0 z-30 flex items-center justify-center bg-black/10 hover:bg-black/40 transition-colors group cursor-pointer"
            (click)="togglePlay.emit()">
            <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
                @if (isPlaying) {
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
                } @else {
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 ml-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                }
            </div>
        </div>
      </div>
    </div>
  `
})
export class PreviewPlayerComponent {
    @Input() activeImage: string | null = null;
    @Input() previousImage: string | null = null;
    @Input() activeSubtitle: string = '';
    @Input() subtitleColor: string = '#F4D03F';
    @Input() isPlaying = false;
    @Input() currentEffect = 'animate-intense-zoom';

    @Output() togglePlay = new EventEmitter<void>();
}
