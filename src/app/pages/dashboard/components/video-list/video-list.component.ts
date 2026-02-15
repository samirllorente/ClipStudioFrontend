
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [RouterLink, DatePipe, NgClass, SlicePipe, TranslateModule],
  template: `
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-white">{{ 'PROJECTS_TITLE' | translate }}</h1>
          <p class="mt-2 text-sm text-gray-400">{{ 'PROJECTS_DESC' | translate }}</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <a routerLink="/dashboard/create" class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
            {{ 'CREATE_PROJECT_BUTTON' | translate }}
          </a>
        </div>
      </div>
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">{{ 'TABLE_SCRIPT_TITLE' | translate }}</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">{{ 'TABLE_STATUS' | translate }}</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">{{ 'TABLE_CREATED_AT' | translate }}</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">{{ 'TABLE_ACTIONS' | translate }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700 bg-gray-900">
                  @for (project of projects(); track project._id) {
                    <tr>
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                        {{ (project.script | slice:0:50) + (project.script.length > 50 ? '...' : '') }}
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                          [ngClass]="{
                            'bg-green-100 text-green-800': project.status === 'completed',
                            'bg-yellow-100 text-yellow-800': project.status === 'processing' || project.status === 'generating_video',
                            'bg-gray-100 text-gray-800': project.status === 'pending' || project.status === 'draft_ready',
                            'bg-red-100 text-red-800': project.status === 'failed'
                          }">
                          {{ project.status }}
                        </span>
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ project.createdAt | date:'short' }}</td>
                      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                        <div class="flex justify-end items-center gap-3">
                          @if(project.status !== 'completed') {
                          <a [routerLink]="['/dashboard/edit', project._id]" class="text-indigo-400 hover:text-indigo-300 transition-colors" [title]="'ACTION_EDIT' | translate">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </a>
                          }
                          @if(project.status === 'completed') {
                              <a [routerLink]="['/dashboard/edit', project._id]" class="text-green-400 hover:text-green-300 transition-colors" [title]="'ACTION_VIEW' | translate">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </a>
                          }
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                        <td colspan="4" class="text-center py-4 text-gray-500">{{ 'NO_PROJECTS_FOUND' | translate }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VideoListComponent implements OnInit {
  http = inject(HttpClient);
  projects = signal<any[]>([]);

  getVideoUrl(projectId: string): string {
    return `http://localhost:3000/projects/${projectId}/final_video.mp4`;
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/projects').subscribe(data => {
      this.projects.set(data);
    });
  }
}
