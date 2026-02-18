import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SocialService, SocialAccount } from '../../../../core/services/social.service';
import { VideoService } from '../../../../core/services/video.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-video-result',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, RouterLink],
  templateUrl: './video-result.component.html',
  styleUrl: './video-result.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoResultComponent implements OnInit {
  @Input() videoUrl: string | null = null;
  @Input() projectId: string | null = null;
  @Input() aspectRatio: string = '9:16';
  @Input() initialTitle: string | undefined = '';
  @Input() initialDescription: string | undefined = '';
  @Output() onBack = new EventEmitter<void>();

  private socialService = inject(SocialService);
  private videoService = inject(VideoService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private fb = inject(FormBuilder);

  accounts = signal<SocialAccount[]>([]);
  isScheduling = signal(false);
  scheduleSuccess = signal(false);

  scheduleForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    publishDate: ['', Validators.required],
    selectedAccounts: this.fb.array([]) // Will hold account IDs
  });

  ngOnInit() {
    this.loadAccounts();
    if (this.initialTitle) {
      this.scheduleForm.patchValue({ title: this.initialTitle });
    }
    if (this.initialDescription) {
      this.scheduleForm.patchValue({ description: this.initialDescription });
    }
  }

  loadAccounts() {
    this.socialService.getAccounts().subscribe(accounts => {
      this.accounts.set(accounts);
    });
  }

  isAccountSelected(accountId: string): boolean {
    const formArray = this.scheduleForm.get('selectedAccounts') as FormArray;
    return formArray.value.includes(accountId);
  }

  toggleAccountSelection(accountId: string, event: any) {
    const formArray = this.scheduleForm.get('selectedAccounts') as FormArray;
    if (event.target.checked) {
      formArray.push(this.fb.control(accountId));
    } else {
      const index = formArray.controls.findIndex(x => x.value === accountId);
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  async schedulePublish() {
    if (this.scheduleForm.invalid || !this.projectId) return;

    this.isScheduling.set(true);
    const formValue = this.scheduleForm.value;

    const payload = {
      title: formValue.title,
      description: formValue.description,
      publishDate: formValue.publishDate,
      accounts: formValue.selectedAccounts
    };

    this.videoService.publish(this.projectId, payload).subscribe({
      next: () => {
        this.isScheduling.set(false);
        this.scheduleSuccess.set(true);
        setTimeout(() => this.scheduleSuccess.set(false), 3000); // Reset success message
      },
      error: (err) => {
        console.error('Publishing failed', err);
        this.isScheduling.set(false);
        this.toastService.show('Failed to schedule publishing', 'error');
      }
    });
  }

  async downloadVideo(event: Event) {
    event.preventDefault();
    if (!this.videoUrl) return;

    try {
      const response = await fetch(this.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `clip_studio_${new Date().getTime()}.mp4`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: just open in new tab if blob fetch fails (e.g. CORS issues)
      window.open(this.videoUrl, '_blank');
    }
  }

  copyToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.toastService.show(this.translate.instant('COPIED_SUCCESS'), 'success');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      this.toastService.show(this.translate.instant('COPIED_ERROR'), 'error');
    });
  }
}
