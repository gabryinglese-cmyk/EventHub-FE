import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEventSummaryComponent } from './booking-event-summary.component';

describe('BookingEventSummaryComponent', () => {
  let component: BookingEventSummaryComponent;
  let fixture: ComponentFixture<BookingEventSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingEventSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingEventSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
