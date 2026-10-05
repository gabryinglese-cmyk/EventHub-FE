import { Routes } from '@angular/router';

import {
  authGuard,
  publicGuard
} from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () =>
          import(
            './features/auth/login/login.component'
          ).then(
            m => m.LoginComponent
          )
      },
      {
        path: 'register',
        canActivate: [publicGuard],
        loadComponent: () =>
          import(
            './features/auth/register/register.component'
          ).then(
            m => m.RegisterComponent
          )
      }
    ]
  },

  {
    path: 'events',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',

        loadComponent: () =>
          import(
            './features/events/event-list/event-list.component'
          ).then(
            m => m.EventListComponent
          )
      },

      {
        path: ':eventId',
        loadComponent: () =>
          import(
            './features/events/event-detail/event-detail.component'
          ).then(
            m => m.EventDetailComponent
          )
      }
    ]
  },


  {
    path: 'bookings',
    canActivateChild: [authGuard],

    children: [

      {
        path: 'create',

        loadComponent: () =>
          import(
            './features/booking/booking-form/booking-form.component'
          ).then(
            m => m.BookingFormComponent
          )
      },

      {
        path: ':bookingId',

        loadComponent: () =>
          import(
            './features/booking/booking-detail/booking-detail.component'
          ).then(
            m => m.BookingDetailComponent
          )
      }

    ]
  },


  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'events'
  },


  {
    path: '**',
    loadComponent: () =>
      import(
        './features/not-found/not-found.component'
      ).then(
        m => m.NotFoundComponent
      )
  }
];