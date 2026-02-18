import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
     selector: 'app-terms-of-service',
     standalone: true,
     imports: [RouterLink, DatePipe, TranslateModule],
     template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto bg-white shadow sm:rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h1 class="text-2xl font-bold leading-6 text-gray-900">{{ 'TERMS.TITLE' | translate }}</h1>
            <a routerLink="/" class="text-sm text-blue-600 hover:text-blue-500">{{ 'TERMS.BACK' | translate }}</a>
        </div>
        <div class="px-4 py-5 sm:p-6 space-y-6 text-gray-700 text-sm leading-relaxed">
           <section>
                <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'TERMS.INTRO.TITLE' | translate }}</h2>
                <p>{{ 'TERMS.INTRO.TEXT' | translate }}</p>
           </section>
           
           <section>
                <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'TERMS.LICENSE.TITLE' | translate }}</h2>
                <p>{{ 'TERMS.LICENSE.TEXT' | translate }}</p>
           </section>

           <section>
                <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'TERMS.RESPONSIBILITIES.TITLE' | translate }}</h2>
                <p>{{ 'TERMS.RESPONSIBILITIES.TEXT' | translate }}</p>
           </section>

           <section>
                <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'TERMS.IP.TITLE' | translate }}</h2>
                <p>{{ 'TERMS.IP.TEXT' | translate }}</p>
           </section>

           <section>
                <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'TERMS.TERMINATION.TITLE' | translate }}</h2>
                <p>{{ 'TERMS.TERMINATION.TEXT' | translate }}</p>
           </section>

           <section>
                <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ 'TERMS.CHANGES.TITLE' | translate }}</h2>
                <p>{{ 'TERMS.CHANGES.TEXT' | translate }}</p>
           </section>
           
           <p class="mt-8 text-xs text-gray-500 border-t pt-4">{{ 'TERMS.LAST_UPDATED' | translate }} {{ currentDate | date:'longDate':undefined:translate.currentLang }}</p>
        </div>
      </div>
    </div>
  `
})
export class TermsOfServiceComponent {
     translate = inject(TranslateService);
     currentDate = new Date();
}
