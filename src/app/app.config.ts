import { ApplicationConfig } from '@angular/core';

import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { providePrimeNG } from 'primeng/config';

import Lara from '@primeng/themes/lara';

import { MessageService } from 'primeng/api';

import { routes } from './app.routes';

import { authInterceptor } from './core/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {

  providers: [

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),

    providePrimeNG({
      theme: {
        preset: Lara,

        options: {
          cssLayer: false
        }
      },

      ripple: true
    }),

    MessageService
  ]
};