import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAlreadyBookedComponent } from './booking-already-booked.component';

describe('BookingAlreadyBookedComponent', () => {
  let component: BookingAlreadyBookedComponent;
  let fixture: ComponentFixture<BookingAlreadyBookedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingAlreadyBookedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingAlreadyBookedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
