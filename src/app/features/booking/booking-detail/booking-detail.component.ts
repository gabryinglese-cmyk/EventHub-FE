import {
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  finalize
} from 'rxjs';

import {
  DatePipe
} from '@angular/common';

import {
  ButtonModule
} from 'primeng/button';

import {
  CardModule
} from 'primeng/card';

import {
  MessageModule
} from 'primeng/message';

import {
  ProgressSpinnerModule
} from 'primeng/progressspinner';

import {
  TagModule
} from 'primeng/tag';

import {
  BookingDto
} from '../../../core/models/booking.model';

import {
  BookingService
} from '../../../core/services/booking.service';


@Component({
  selector: 'app-booking-detail',
  standalone: true,

  imports: [
    DatePipe,
    ButtonModule,
    CardModule,
    MessageModule,
    ProgressSpinnerModule,
    TagModule
  ],

  templateUrl: './booking-detail.component.html'
})
export class BookingDetailComponent {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly bookingService =
    inject(BookingService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly booking =
    signal<BookingDto | null>(null);

  readonly isLoading =
    signal(true);

  readonly errorMessage =
    signal<string | undefined>(undefined);

  constructor() {
    this.loadBooking();
  }

  private loadBooking(): void {
    const bookingId =
      this.route.snapshot.paramMap.get(
        'bookingId'
      );

    if (!bookingId) {
      this.errorMessage.set(
        'ID prenotazione non valido.'
      );
      this.isLoading.set(false);
      return;
    }

    this.bookingService
      .getBookingById(bookingId)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: response => {
          this.booking.set(
            response.data
          );
        },
        error: error => {
          console.error(
            '[BOOKING DETAIL] Error:',
            error
          );
          this.errorMessage.set(
            error?.error?.message ??
            'Prenotazione non trovata.'
          );
        }
      });
  }

  goBack(): void {
    this.router.navigate([
      '/events'
    ]);

  }


  goToEvent(): void {
    const eventId =
      this.booking()?.event.id;

    if (!eventId) {
      return;
    }

    this.router.navigate([
      '/events',
      eventId
    ]);

  }

}