import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { EventDto } from '../../../core/models/event.model';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BookingAlreadyBookedComponent } from '../booking-already-booked/booking-already-booked.component';
import { BookingEventSummaryComponent } from '../booking-event-summary/booking-event-summary.component';
import { BookingFormCardComponent } from '../booking-form-card/booking-form-card.component';
import { BookingSuccessDialogComponent } from '../booking-success-dialog/booking-success-dialog.component';


@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ProgressSpinnerModule,
    ButtonModule,
    MessageModule,

    BookingEventSummaryComponent,
    BookingFormCardComponent,
    BookingAlreadyBookedComponent,
    BookingSuccessDialogComponent
  ],

  templateUrl: './booking-form.component.html'
})

export class BookingFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  readonly event = signal<EventDto | null>(null);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | undefined>(undefined);
  readonly isAlreadyBooked = signal(false);
  readonly showSuccessDialog = signal(false);
  readonly createdBooking = signal<string | null>(null);
  private readonly eventId = signal<string | null>(null);

  readonly bookingForm =
    this.fb.nonNullable.group({
      numberOfTickets: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ]
    });

  constructor() {
    this.loadEvent();
  }

  private loadEvent(): void {
    const eventId = this.route.snapshot.queryParamMap.get('eventId');
    if (!eventId) {
      this.errorMessage.set(
        'Evento non specificato.'
      );
      return;
    }

    this.eventId.set(eventId);
    this.isLoading.set(true);
    this.errorMessage.set(undefined);
    this.isAlreadyBooked.set(false);
    this.eventService
      .getEventById(eventId)
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
          const event = response.data;
          this.event.set(event);
          this.bookingForm.controls
            .numberOfTickets
            .setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(
                event.maxCapacity
              )
            ]);
          this.bookingForm.controls
            .numberOfTickets
            .updateValueAndValidity();
        },
        error: error => {
          this.errorMessage.set(
            error?.error?.message ??
            'Impossibile caricare l\'evento.'
          );
        }
      });
  }

  submitBooking(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const event = this.event();
    if (!event) {
      this.errorMessage.set(
        'Evento non disponibile.'
      );
      return;
    }

    const user = this.authService.currentState.user;
    if (!user) {
      this.router.navigate(
        ['/auth/login'],
        {
          queryParams: {
            returnUrl:
              `/bookings/create?eventId=${event.id}`
          }
        }
      );
      return;
    }

    const numberOfTickets =
      this.bookingForm.controls
        .numberOfTickets
        .getRawValue();
    this.errorMessage.set(undefined);
    this.isAlreadyBooked.set(false);
    this.isSubmitting.set(true);
    this.bookingService
      .createBooking({
        eventId: event.id,
        userId: user.id,
        numberOfTickets
      })
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(() => {
          this.isSubmitting.set(false);
        })
      )
      .subscribe({
        next: response => {
          const booking = response.data;
          this.createdBooking.set(
            booking.id
          );
          this.showSuccessDialog.set(
            true
          );
        },
        error: error => {
          console.error(
            '[BOOKING] Create booking error:',
            error
          );

          if (error?.status === 409) {
            this.isAlreadyBooked.set(
              true
            );
            return;
          }
          this.errorMessage.set(
            error?.error?.message ??
            'Impossibile completare la prenotazione.'
          );
        }
      });
  }

  viewBooking(): void {
    const bookingId =
      this.createdBooking();
    if (!bookingId) {
      return;
    }
    this.showSuccessDialog.set(
      false
    );
    this.router.navigate([
      '/bookings',
      bookingId
    ]);
  }

  backToEvents(): void {
    this.showSuccessDialog.set(
      false
    );
    this.router.navigate([
      '/events'
    ]);
  }

  cancel(): void {
    const eventId =
      this.eventId();
    if (!eventId) {
      this.router.navigate([
        '/events'
      ]);
      return;
    }
    this.router.navigate([
      '/events',
      eventId
    ]);
  }

  get ticketsControl() {
    return this.bookingForm.controls
      .numberOfTickets;
  }

  isFieldInvalid(): boolean {
    const control =
      this.ticketsControl;
    return control.invalid &&
      (
        control.dirty ||
        control.touched
      );
  }
}