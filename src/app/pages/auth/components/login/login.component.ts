
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div class="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-white">{{ 'LOGIN_TITLE' | translate }}</h2>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="email-address" class="block text-sm font-medium leading-6 text-white">{{ 'EMAIL_LABEL' | translate }}</label>
              <div class="mt-2">
                <input id="email-address" formControlName="email" type="email" autocomplete="email" required
                  class="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  [placeholder]="'ENTER_EMAIL_PLACEHOLDER' | translate">
              </div>
            </div>
            <div>
              <label for="password" class="block text-sm font-medium leading-6 text-white">{{ 'PASSWORD_LABEL' | translate }}</label>
              <div class="mt-2">
                <input id="password" formControlName="password" type="password" autocomplete="current-password" required
                  class="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                   [placeholder]="'ENTER_PASSWORD_PLACEHOLDER' | translate">
              </div>
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || isLoading()"
              class="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <!-- Lock Icon -->
                <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd" />
                </svg>
              </span>
              {{ 'SIGN_IN_BUTTON' | translate }}
            </button>
          </div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-gray-800 px-2 text-gray-400">{{ 'OR_CONTINUE_WITH' | translate }}</span>
            </div>
          </div>

          <div>
            <button type="button" (click)="loginWithGoogle()"
              class="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer">
              <svg class="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12.0003 20.45c4.6653 0 8.55-3.09 9.945-7.44h-2.52c-1.125 3.06-4.065 5.235-7.425 5.235-4.41 0-7.995-3.585-7.995-7.995s3.585-7.995 7.995-7.995c2.055 0 3.93.78 5.355 2.055l2.49-2.49C17.655.24 14.9703-.75 12.0003-.75 5.2503-.75-.2497 4.75-.2497 11.5s5.49 12.25 12.25 12.25z" fill="#34A853"/>
                  <path d="M23.0498 11.5c0-.825-.075-1.62-.21-2.4h-10.84v4.56h6.39c-.3 1.485-1.17 2.73-2.43 3.57v2.85h3.915c2.28-2.1 3.585-5.19 3.175-8.58z" fill="#4285F4"/>
                  <path d="M5.0497 14.655c-.525-1.545-.525-3.21 0-4.755l-2.91-2.31C.7747 9.87-.2503 13.125.7747 16.38l4.275-1.725z" fill="#FBBC05"/>
                  <path d="M12.0003 4.29c1.935 0 3.69.705 5.07 1.83l2.535-2.535C17.655 1.575 14.9703.25 12.0003.25c-4.665 0-8.55 3.09-9.945 7.44l2.94 2.31c1.125-3.06 4.065-5.235 7.425-5.235z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
          
           <div class="text-sm text-center">
            <a routerLink="/auth/register" class="font-medium text-indigo-400 hover:text-indigo-300">
              {{ 'DONT_HAVE_ACCOUNT_REGISTER' | translate }}
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = signal(false);

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const val = this.loginForm.value;
      if (val.email && val.password) {
        this.authService.login({ email: val.email!, password: val.password! }).subscribe({
          next: () => this.isLoading.set(false),
          error: (err: any) => {
            console.error('Login failed', err);
            this.isLoading.set(false);
          }
        });
      }
    }
  }

  loginWithGoogle() {
    this.authService.googleLogin();
  }
}
