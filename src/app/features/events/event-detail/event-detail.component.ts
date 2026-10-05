import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { EventDto } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,

  imports: [
    DatePipe,
    ButtonModule,
    CardModule,
    TagModule,
    ProgressSpinnerModule,
    MessageModule
  ],

  templateUrl: './event-detail.component.html'
})
export class EventDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);
  readonly event = signal<EventDto | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | undefined>(undefined);

  constructor() {
    this.loadEvent();
  }

  private loadEvent(): void {

    const eventId =
      this.route.snapshot.paramMap.get(
        'eventId'
      );

    if (!eventId) {
      this.errorMessage.set(
        'ID evento non valido.'
      );
      this.isLoading.set(false);
      return;
    }

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
          this.event.set(
            response.data
          );
        },

        error: error => {
          this.errorMessage.set(
            error?.error?.message ??
            'Evento non trovato.'
          );
        }
      });
  }

  goBack(): void {
    this.router.navigate([
      '/events'
    ]);
  }

  bookEvent(): void {
    const eventId =
      this.event()?.id;
    if (!eventId) {
      return;
    }
    this.router.navigate(
      ['/bookings/create'],
      {
        queryParams: {
          eventId
        }
      }
    );
  }
}