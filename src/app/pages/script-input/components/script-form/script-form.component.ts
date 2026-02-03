import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-script-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    template: `
    <form [formGroup]="scriptForm" (ngSubmit)="onSubmit()">
      <div class="mb-6">
        <label for="script" class="block text-sm font-medium text-slate-300 mb-2">
          {{ 'VIDEO_SCRIPT_LABEL' | translate }}
        </label>
        <div class="relative group">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
          <textarea id="script" formControlName="script" rows="8"
            class="relative w-full bg-slate-900/90 text-slate-100 rounded-xl border border-slate-700 focus:border-transparent focus:ring-2 focus:ring-indigo-500 p-4 transition-all resize-none placeholder-slate-600 focus:outline-none"
            [placeholder]="'PLACEHOLDER' | translate"></textarea>
        </div>
        @if (scriptControl.touched && scriptControl.hasError('required')) {
          <p class="mt-2 text-sm text-red-400">{{ 'ERROR_REQUIRED' | translate }}</p>
        }
        @if (errorMessage) {
          <div class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {{ errorMessage | translate }}
          </div>
        }
      </div>

      <button type="submit" [disabled]="scriptForm.invalid || isSubmitting"
        class="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 p-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span class="relative flex items-center justify-center gap-2">
          @if (isSubmitting) {
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ 'PROCESSING' | translate }}
          } @else {
            <span>{{ 'GENERATE_BUTTON' | translate }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          }
        </span>
      </button>
    </form>
  `
})
export class ScriptFormComponent {
    @Input() isSubmitting = false;
    @Input() errorMessage: string | null = null;
    @Output() formSubmit = new EventEmitter<string>();

    private fb = inject(FormBuilder);

    scriptForm: FormGroup = this.fb.group({
        script: ['', [Validators.required, Validators.minLength(10)]],
    });

    get scriptControl() {
        return this.scriptForm.get('script')!;
    }

    onSubmit() {
        if (this.scriptForm.valid) {
            this.formSubmit.emit(this.scriptForm.value.script);
        } else {
            this.scriptForm.markAllAsTouched();
        }
    }
}
