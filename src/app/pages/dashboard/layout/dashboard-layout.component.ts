import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, FooterComponent],
  template: `
    <div class="h-screen flex overflow-hidden bg-gray-900">
      <!-- Sidebar -->
      <div class="hidden md:flex md:flex-shrink-0">
        <div class="flex flex-col w-64">
           <!-- ... Keep existing sidebar ... -->
          <div class="flex flex-col h-0 flex-1 bg-gray-800 border-r border-gray-700">
            <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div class="flex items-center flex-shrink-0 px-4">
                <span class="text-xl font-bold text-white">Clip Studio</span>
              </div>
              <nav class="mt-5 flex-1 px-2 space-y-1">
                <a routerLink="/dashboard/videos" routerLinkActive="bg-gray-900 text-white" 
                   class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                   <svg class="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.866v6.268a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                   </svg>
                  {{ 'DASHBOARD_MY_VIDEOS' | translate }}
                </a>
                <a routerLink="/dashboard/create" routerLinkActive="bg-gray-900 text-white" 
                   class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                   <svg class="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                   </svg>
                  {{ 'DASHBOARD_CREATE_NEW' | translate }}
                </a>
                <a routerLink="/dashboard/social" routerLinkActive="bg-gray-900 text-white" 
                   class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                   <svg class="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                   </svg>
                  {{ 'DASHBOARD_SOCIAL_CONFIG' | translate }}
                </a>
              </nav>
            </div>
            <div class="flex-shrink-0 flex bg-gray-700 p-4">
              <div class="flex-shrink-0 w-full group block">
                <div class="flex items-center">
                  <div>
                    <img class="inline-block h-9 w-9 rounded-full" 
                         [src]="avatarUrl()" 
                         alt="User Avatar">
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-white">{{ userName() }}</p>
                    <p class="text-xs font-medium text-gray-300 group-hover:text-gray-200 cursor-pointer" (click)="logout()">{{ 'DASHBOARD_SIGN_OUT' | translate }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div class="py-6 min-h-full flex flex-col">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex-1 w-full">
              <router-outlet></router-outlet>
            </div>
            <div class="mt-auto">
               <app-footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);
  translate = inject(TranslateService);

  user = this.authService.currentUser;

  userName = computed(() => {
    const u = this.user();
    if (!u) return this.translate.instant('DASHBOARD_GUEST');
    return `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
  });

  avatarUrl = computed(() => {
    const u = this.user();
    if (u && u.avatar) return u.avatar;
    // Fallback to gravatar-ish or placeholder
    // Using a generic placeholder service for now if no avatar
    return `https://ui-avatars.com/api/?name=${this.userName()}&background=random`;
  });

  logout() {
    this.authService.logout();
  }
}
