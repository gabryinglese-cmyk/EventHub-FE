import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-booking-already-booked',
  standalone: true,
  imports: [
    RouterLink,
    CardModule,
    ButtonModule
  ],
  templateUrl: './booking-already-booked.component.html'
})
export class BookingAlreadyBookedComponent { }