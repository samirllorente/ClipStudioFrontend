import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink, TranslateModule],
    template: `
    <footer class="w-full py-4 px-6 flex justify-center items-center space-x-6 text-sm text-gray-500">
      <a routerLink="/terms" class="hover:text-gray-400 decoration-none transition-colors duration-200">
        {{ 'TERMS.TITLE' | translate }}
      </a>
      <span class="text-gray-700">•</span>
      <a routerLink="/privacy" class="hover:text-gray-400 decoration-none transition-colors duration-200">
        {{ 'PRIVACY.TITLE' | translate }}
      </a>
    </footer>
  `
})
export class FooterComponent { }
