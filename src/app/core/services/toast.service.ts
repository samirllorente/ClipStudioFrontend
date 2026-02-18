import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts = signal<Toast[]>([]);
    private counter = 0;

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration: number = 3000) {
        const id = ++this.counter;
        const newToast: Toast = { id, message, type };

        this.toasts.update(current => [...current, newToast]);

        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    remove(id: number) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
