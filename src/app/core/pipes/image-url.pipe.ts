import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'imageUrl',
    standalone: true,
    pure: false
})
export class ImageUrlPipe implements PipeTransform {
    transform(imagePath: string | null | undefined, projectId: string | null | undefined): string {
        if (!imagePath || !projectId) {
            return '';
        }

        // If it's already a full URL (base64 or remote), return as is
        if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
            return imagePath;
        }

        const filename = imagePath.split('/').pop();
        return `${environment.apiUrl}/projects/${projectId}/${filename}?t=${Date.now()}`;
    }
}
