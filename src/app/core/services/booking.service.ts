import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ApiResponse } from '../models/auth.models';

import {
    BookingDto,
    CreateBookingRequest
} from '../models/booking.model';


@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private readonly http =
        inject(HttpClient);


    private readonly apiUrl =
        `${environment.apiUrl}/bookings`;


    createBooking(
        request: CreateBookingRequest
    ): Observable<ApiResponse<BookingDto>> {

        return this.http.post<
            ApiResponse<BookingDto>
        >(
            this.apiUrl,
            request
        );
    }


    getBookingById(
        bookingId: string
    ): Observable<ApiResponse<BookingDto>> {

        return this.http.get<
            ApiResponse<BookingDto>
        >(
            `${this.apiUrl}/${bookingId}`
        );
    }


    getBookingsByUser(
        userId: string
    ): Observable<ApiResponse<BookingDto[]>> {

        return this.http.get<
            ApiResponse<BookingDto[]>
        >(
            `${this.apiUrl}/user/${userId}`
        );
    }


    getBookingsByEvent(
        eventId: string
    ): Observable<ApiResponse<BookingDto[]>> {

        return this.http.get<
            ApiResponse<BookingDto[]>
        >(
            `${this.apiUrl}/event/${eventId}`
        );
    }


    confirmBooking(
        bookingId: string
    ): Observable<ApiResponse<BookingDto>> {

        return this.http.put<
            ApiResponse<BookingDto>
        >(
            `${this.apiUrl}/${bookingId}/confirm`,
            null
        );
    }


    cancelBooking(
        bookingId: string
    ): Observable<ApiResponse<BookingDto>> {

        return this.http.put<
            ApiResponse<BookingDto>
        >(
            `${this.apiUrl}/${bookingId}/cancel`,
            null
        );
    }


    deleteBooking(
        bookingId: string
    ): Observable<ApiResponse<void>> {

        return this.http.delete<
            ApiResponse<void>
        >(
            `${this.apiUrl}/${bookingId}`
        );
    }

}