import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormCardComponent } from './booking-form-card.component';

describe('BookingFormCardComponent', () => {
  let component: BookingFormCardComponent;
  let fixture: ComponentFixture<BookingFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
