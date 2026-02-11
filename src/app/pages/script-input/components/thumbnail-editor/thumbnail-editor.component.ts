import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-thumbnail-editor',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    templateUrl: './thumbnail-editor.component.html',
    styleUrl: './thumbnail-editor.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbnailEditorComponent {
    @Input() thumbnailUrl: string | null = null;
    @Input() prompt: string = '';
    @Input() isLoading = false;
    @Input() aspectRatio: string = '9:16';
    @Output() regenerate = new EventEmitter<string>();
    @Output() upload = new EventEmitter<File>();

    onRegenerate() {
        this.regenerate.emit(this.prompt);
    }

    handleUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.upload.emit(input.files[0]);
        }
        input.value = ''; // Reset
    }
}
