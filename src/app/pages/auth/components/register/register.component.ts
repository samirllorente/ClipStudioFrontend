import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, FooterComponent],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div class="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-white">{{ 'REGISTER_TITLE' | translate }}</h2>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label for="first-name" class="block text-sm font-medium leading-6 text-white">{{ 'FIRST_NAME_LABEL' | translate }}</label>
                <div class="mt-2">
                  <input id="first-name" formControlName="firstName" type="text" required maxlength="50"
                    class="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    [placeholder]="'FIRST_NAME_PLACEHOLDER' | translate">
                </div>
              </div>
              <div>
                <label for="last-name" class="block text-sm font-medium leading-6 text-white">{{ 'LAST_NAME_LABEL' | translate }}</label>
                <div class="mt-2">
                  <input id="last-name" formControlName="lastName" type="text" required maxlength="50"
                    class="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    [placeholder]="'LAST_NAME_PLACEHOLDER' | translate">
                </div>
              </div>
            </div>

            <div>
              <label for="cellphone" class="block text-sm font-medium leading-6 text-white">{{ 'CELLPHONE_LABEL' | translate }}</label>
              <div class="mt-2">
                <input id="cellphone" formControlName="cellphone" type="tel" maxlength="20"
                  class="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  [placeholder]="'CELLPHONE_PLACEHOLDER_EXAMPLE' | translate">
              </div>
            </div>

            <div>
              <label for="email-address" class="block text-sm font-medium leading-6 text-white">{{ 'EMAIL_LABEL' | translate }}</label>
              <div class="mt-2">
                <input id="email-address" formControlName="email" type="email" autocomplete="email" required maxlength="100"
                  class="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  [placeholder]="'ENTER_EMAIL_PLACEHOLDER' | translate">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium leading-6 text-white">{{ 'PASSWORD_LABEL' | translate }}</label>
              <div class="mt-2">
                <input id="password" formControlName="password" type="password" autocomplete="new-password" required maxlength="100"
                  class="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  [placeholder]="'MIN_CHARACTERS_PLACEHOLDER' | translate">
              </div>
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="registerForm.invalid || isLoading()"
              class="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {{ 'REGISTER_BUTTON' | translate }}
            </button>
          </div>
          
           <div class="text-sm text-center">
            <a routerLink="/auth/login" class="font-medium text-indigo-400 hover:text-indigo-300">
              {{ 'ALREADY_HAVE_ACCOUNT_SIGN_IN' | translate }}
            </a>
          </div>
        </form>
      </div>
      <app-footer class="mt-8" />
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    cellphone: ['', [Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
  });

  isLoading = signal(false);

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const val = this.registerForm.value;
      this.authService.register(val).subscribe({
        next: () => this.isLoading.set(false),
        error: (err: any) => {

          console.error('Register failed', err);
          this.isLoading.set(false);
        }
      });
    }
  }
}
