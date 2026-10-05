import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventDto } from '../../../core/models/event.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-booking-form-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    MessageModule,
    DividerModule
  ],
  templateUrl: './booking-form-card.component.html'
})
export class BookingFormCardComponent {
  readonly event = input.required<EventDto>();
  readonly bookingForm = input.required<FormGroup>();
  readonly isSubmitting = input(false);
  readonly submitted = output<void>();
  readonly cancelled = output<void>();

  get ticketsControl() {
    return this.bookingForm()
      .get('numberOfTickets')!;

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