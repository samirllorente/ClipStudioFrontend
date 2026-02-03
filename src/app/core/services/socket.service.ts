
import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;

    constructor() {
        this.socket = io(environment.wsUrl);
    }

    joinProject(projectId: string) {
        this.socket.emit('join-project', projectId);
    }

    onProjectUpdate(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('project-update', (data) => {
                observer.next(data);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
