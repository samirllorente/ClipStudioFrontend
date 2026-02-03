export interface VideoScript {
    script: string;
}

export interface VideoResponse {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    url?: string;
    message?: string;
}
