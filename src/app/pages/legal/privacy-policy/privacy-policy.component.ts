import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
      selector: 'app-privacy-policy',
      standalone: true,
      imports: [RouterLink, DatePipe, TranslateModule],
      template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto bg-white shadow sm:rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h1 class="text-2xl font-bold leading-6 text-gray-900">{{ 'PRIVACY.TITLE' | translate }}</h1>
            <a routerLink="/" class="text-sm text-blue-600 hover:text-blue-500">{{ 'PRIVACY.BACK' | translate }}</a>
        </div>
        <div class="px-4 py-5 sm:p-6 space-y-6 text-gray-700 text-sm leading-relaxed">
           <section>
                <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'PRIVACY.INFO_COLLECT.TITLE' | translate }}</h2>
                <p>{{ 'PRIVACY.INFO_COLLECT.TEXT' | translate }}</p>
           </section>
           
           <section>
                 <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'PRIVACY.USE_INFO.TITLE' | translate }}</h2>
                 <p>{{ 'PRIVACY.USE_INFO.TEXT' | translate }}</p>
           </section>

           <section>
                 <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'PRIVACY.SHARING.TITLE' | translate }}</h2>
                 <p>{{ 'PRIVACY.SHARING.TEXT' | translate }}</p>
           </section>

           <section>
                 <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'PRIVACY.COOKIES.TITLE' | translate }}</h2>
                 <p>{{ 'PRIVACY.COOKIES.TEXT' | translate }}</p>
           </section>

           <section>
                 <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'PRIVACY.SECURITY.TITLE' | translate }}</h2>
                 <p>{{ 'PRIVACY.SECURITY.TEXT' | translate }}</p>
           </section>

           <section>
                 <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'PRIVACY.CONTACT.TITLE' | translate }}</h2>
                 <p>{{ 'PRIVACY.CONTACT.TEXT' | translate }}</p>
           </section>
           
           <p class="mt-8 text-xs text-gray-500 border-t pt-4">{{ 'PRIVACY.LAST_UPDATED' | translate }} {{ currentDate | date:'longDate':undefined:translate.currentLang }}</p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyPolicyComponent {
      translate = inject(TranslateService);
      currentDate = new Date();
}
