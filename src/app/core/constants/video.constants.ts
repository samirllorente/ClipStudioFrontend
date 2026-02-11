export const VIDEO_CONSTANTS = {
    DEFAULT_SUBTITLE_COLOR: '#F4D03F',
    ANIMATIONS: {
        ZOOM: 'animate-intense-zoom',
        ORBITAL: 'animate-intense-orbital'
    },
    STATUS: {
        INPUT: 'input',
        PROCESSING: 'processing',
        PREVIEW: 'preview',
        COMPLETED: 'completed',
        FAILED: 'failed',
        GENERATING: 'generating'
    },
    SUBTITLE_COLORS: ['#FFFFFF', '#F4D03F', '#2ECC71', '#3498DB', '#E74C3C'],
    DEFAULTS: {
        AUDIO_DURATION: 15,
        TRANSITION_DURATION_MS: 1000
    }
} as const;

export type ProcessingStatus = typeof VIDEO_CONSTANTS.STATUS[keyof typeof VIDEO_CONSTANTS.STATUS];
