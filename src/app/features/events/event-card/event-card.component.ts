import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { EventDto } from '../../../core/models/event.model';


@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    DatePipe,
    ButtonModule,
    CardModule,
    TagModule
  ],
  templateUrl: './event-card.component.html'
})
export class EventCardComponent {

  readonly event = input.required<EventDto>();

  readonly view = output<string>();
  readonly edit = output<EventDto>();
  readonly delete = output<EventDto>();

  getEventSeverity(): 'success' | 'warn' | 'danger' {
    const now = new Date();
    const eventDate = new Date(this.event().dateTime);

    if (eventDate < now) {
      return 'danger';
    }

    return 'success';
  }

  onView(): void {
    this.view.emit(this.event().id);
  }

  onEdit(): void {
    this.edit.emit(this.event());
  }

  onDelete(): void {
    this.delete.emit(this.event());
  }
}
