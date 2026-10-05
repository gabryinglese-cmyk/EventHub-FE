import { Component, DestroyRef, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';
import { CreateEventRequest, EventDto, UpdateEventRequest } from '../../../core/models/event.model';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-dialog',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    ButtonModule,
    MessageModule
  ],

  templateUrl: './event-dialog.component.html'
})
export class EventDialogComponent {

  private readonly fb = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  @Input()
  event: EventDto | null = null;
  @Input()
  visible = false;
  @Output()
  visibleChange = new EventEmitter<boolean>();
  @Output()
  saved = new EventEmitter<void>();

  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | undefined>(undefined);
  readonly eventForm = this.fb.nonNullable.group({

    title: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]
    ],

    description: [
      '',
      [
        Validators.maxLength(2000)
      ]
    ],

    dateTime: [
      null as Date | null,
      Validators.required
    ],

    location: [
      '',
      [
        Validators.required
      ]
    ],

    maxCapacity: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  ngOnChanges(): void {

    this.errorMessage.set(undefined);
    if (this.event) {
      this.populateForm(this.event);
    } else {
      this.resetForm();
    }
  }

  save(): void {

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(undefined);

    const value = this.eventForm.getRawValue();

    const payload: CreateEventRequest = {
      title: value.title.trim(),
      description:
        value.description.trim() || null,
      dateTime:
        value.dateTime!.toISOString(),
      location:
        value.location.trim(),
      maxCapacity:
        value.maxCapacity
    };

    const request$ =
      this.event
        ? this.eventService.updateEvent(
          this.event.id,
          payload satisfies UpdateEventRequest
        )
        : this.createEvent(payload);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSaving.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.saved.emit();
          this.close();
        },

        error: error => {
          this.errorMessage.set(
            error?.error?.message ??
            'Impossibile salvare l\'evento.'
          );
        }
      });
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  isFieldInvalid(
    field:
      'title' |
      'description' |
      'dateTime' |
      'location' |
      'maxCapacity'
  ): boolean {
    const control =
      this.eventForm.controls[field];
    return control.invalid &&
      (control.dirty || control.touched);
  }

  private createEvent(payload: CreateEventRequest) {

    const userId = this.authService.currentState.user?.id;
    if (!userId) {
      throw new Error(
        'Utente autenticato non disponibile.'
      );
    }
    return this.eventService.createEvent(
      payload,
      userId
    );
  }

  private populateForm(event: EventDto): void {
    this.eventForm.patchValue({
      title: event.title,
      description: event.description ?? '',
      dateTime: new Date(event.dateTime),
      location: event.location,
      maxCapacity: event.maxCapacity
    });
  }

  private resetForm(): void {
    this.eventForm.reset({
      title: '',
      description: '',
      dateTime: null,
      location: '',
      maxCapacity: 1
    });
  }
}