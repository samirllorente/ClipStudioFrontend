export interface VideoScript {
    script: string;
    aspectRatio?: string;
}

export interface VideoResponse {
    projectId: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    videoPath?: string;
    message?: string;
}
