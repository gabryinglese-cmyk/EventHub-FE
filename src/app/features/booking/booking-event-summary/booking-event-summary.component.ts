import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { EventDto } from '../../../core/models/event.model';


@Component({
  selector: 'app-booking-event-summary',
  standalone: true,
  imports: [
    DatePipe,
    CardModule,
    TagModule,
    DividerModule
  ],
  templateUrl: './booking-event-summary.component.html'
})
export class BookingEventSummaryComponent {

  readonly event = input.required<EventDto>();

}