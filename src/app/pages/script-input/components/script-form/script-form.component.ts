import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-script-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './script-form.component.html',
  styleUrl: './script-form.component.css'
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
