import {
  Component,
  input,
  output
} from '@angular/core';

import { EventDto } from '../../../core/models/event.model';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-booking-success-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    DividerModule
  ],
  templateUrl: './booking-success-dialog.component.html'
})
export class BookingSuccessDialogComponent {

  readonly visible = input(false);
  readonly visibleChange = output<boolean>();
  readonly event = input<EventDto | null>(null);
  readonly viewBooking = output<void>();
  readonly backToEvents = output<void>();

}