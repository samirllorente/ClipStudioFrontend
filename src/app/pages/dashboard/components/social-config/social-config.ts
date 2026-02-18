
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SocialService, SocialAccount } from '../../../../core/services/social.service';

@Component({
  selector: 'app-social-config',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
            {{ 'SOCIAL_SETTINGS_TITLE' | translate }}
          </h2>
          <p class="mt-1 text-sm text-gray-400">
            {{ 'SOCIAL_SETTINGS_DESC' | translate }}
          </p>
        </div>
      </div>

      <!-- Connected Accounts List -->
      <div class="bg-gray-800 shadow sm:rounded-lg overflow-hidden mb-8">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-white">{{ 'CONNECTED_ACCOUNTS' | translate }}</h3>
        </div>
        <div class="border-t border-gray-700">
          <ul role="list" class="divide-y divide-gray-700">
            @for (account of accounts(); track account._id) {
              <li class="px-4 py-4 sm:px-6 hover:bg-gray-750 transition-colors flex items-center justify-between">
                <div class="flex items-center">
                  <!-- Icon based on platform -->
                  <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white"
                       [ngClass]="{
                         'bg-blue-600': account.platform === 'facebook',
                         'bg-pink-600': account.platform === 'instagram',
                         'bg-black border border-gray-600': account.platform === 'tiktok',
                         'bg-red-600': account.platform === 'youtube'
                       }">
                    <!-- Simple icons or initials -->
                    <span class="font-bold text-xs uppercase">{{ account.platform.substring(0, 2) }}</span>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-white">{{ account.providerName }}</p>
                    <p class="text-sm text-gray-400 capitalize">{{ account.platform }}</p>
                  </div>
                </div>
                <div>
                  <button (click)="disconnect(account._id)" class="text-red-400 hover:text-red-300 text-sm font-medium">
                    {{ 'DISCONNECT' | translate }}
                  </button>
                </div>
              </li>
            } @empty {
              <li class="px-4 py-8 text-center text-gray-400 text-sm">
                {{ 'NO_ACCOUNTS_CONNECTED' | translate }}
              </li>
            }
          </ul>
        </div>
      </div>

      <!-- Add New Account Actions -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Facebook -->
        <button (click)="connect('facebook')" 
                class="relative block w-full border-2 border-gray-600 border-dashed rounded-lg p-6 text-center hover:border-blue-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all group">
            <div class="mx-auto h-12 w-12 text-blue-500 group-hover:text-blue-400">
                <!-- FB Icon (simplified) -->
                <svg fill="currentColor" viewBox="0 0 24 24" class="h-12 w-12"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <span class="mt-2 block text-sm font-medium text-white group-hover:text-blue-400">Connect Facebook</span>
        </button>

        <!-- Instagram -->
        <button (click)="connect('instagram')" 
                class="relative block w-full border-2 border-gray-600 border-dashed rounded-lg p-6 text-center hover:border-pink-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all group">
            <div class="mx-auto h-12 w-12 text-pink-500 group-hover:text-pink-400">
                 <!-- Instagram Icon (simplified) -->
                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-12 w-12" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
            <span class="mt-2 block text-sm font-medium text-white group-hover:text-pink-400">Connect Instagram</span>
        </button>

        <!-- TikTok -->
        <button (click)="connect('tiktok')" 
                class="relative block w-full border-2 border-gray-600 border-dashed rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all group">
            <div class="mx-auto h-12 w-12 text-white group-hover:text-gray-300">
                <!-- TikTok Icon -->
                <svg fill="currentColor" viewBox="0 0 24 24" class="h-12 w-12"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12v8.76c-.52 4.03-4.18 6.77-8.21 6.13-2.97-.47-5.43-2.58-6.35-5.46-.38-1.2-.38-2.5.01-3.7.94-2.88 3.4-4.99 6.36-5.46.26-.04.53-.06.79-.06v4.22c-.67.12-1.31.5-1.74 1.07-.86 1.15-.55 2.79.67 3.56.65.41 1.46.54 2.2.35 1.74-.45 2.87-2.14 2.69-3.92V.02z"/></svg>

            </div>
            <span class="mt-2 block text-sm font-medium text-white group-hover:text-gray-300">Connect TikTok</span>
        </button>
        
        <!-- YouTube -->
        <button (click)="connect('youtube')" 
                class="relative block w-full border-2 border-gray-600 border-dashed rounded-lg p-6 text-center hover:border-red-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all group">
            <div class="mx-auto h-12 w-12 text-red-600 group-hover:text-red-500">
                 <!-- YouTube Icon -->
                 <svg fill="currentColor" viewBox="0 0 24 24" class="h-12 w-12"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            <span class="mt-2 block text-sm font-medium text-white group-hover:text-red-400">Connect YouTube</span>
        </button>
      </div>
    </div>
  `
})
export class SocialConfigComponent {
  socialService = inject(SocialService);
  accounts = signal<SocialAccount[]>([]);

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.socialService.getAccounts().subscribe(accounts => this.accounts.set(accounts));
  }

  connect(platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube') {
    // In a real app, this would redirect to auth URL.
    // For now, we simulate success with backend mock.
    this.socialService.connect(platform).subscribe(() => {
      this.loadAccounts();
    });
  }

  disconnect(id: string) {
    if (confirm('Are you sure you want to disconnect this account?')) {
      this.socialService.disconnect(id).subscribe(() => this.loadAccounts());
    }
  }
}
