import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoService } from '../../core/services/video.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-script-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './script-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptInputComponent {
    private fb = inject(FormBuilder);
    private videoService = inject(VideoService);
    private translate = inject(TranslateService);

    scriptForm: FormGroup = this.fb.group({
        script: ['', [Validators.required, Validators.minLength(10)]],
    });

    isSubmitting = signal(false);
    errorMessage = signal<string | null>(null);

    get scriptControl() {
        return this.scriptForm.get('script')!;
    }

    onSubmit() {
        if (this.scriptForm.valid) {
            this.isSubmitting.set(true);
            this.errorMessage.set(null);
            const script = this.scriptForm.value.script;

            this.videoService.generateVideo(script)
                .pipe(
                    catchError((err) => {
                        console.error('Error generating video:', err);
                        this.errorMessage.set('ERROR_SERVER_CONNECT');
                        return of(null);
                    }),
                    finalize(() => this.isSubmitting.set(false))
                )
                .subscribe((response) => {
                    if (response) {
                        console.log('Video generation started:', response);
                        const msg = this.translate.instant('VIDEO_STARTED');
                        alert(msg + response.id);
                        this.scriptForm.reset();
                    }
                });
        } else {
            this.scriptForm.markAllAsTouched();
        }
    }
}
