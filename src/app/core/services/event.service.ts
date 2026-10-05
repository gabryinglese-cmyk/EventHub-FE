import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.models';
import { CreateEventRequest, EventDto, EventFilters, EventPageRequest, PageResponse, UpdateEventRequest } from '../models/event.model';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/events`;

    getAllEvents(
        request: EventPageRequest
    ): Observable<ApiResponse<PageResponse<EventDto>>> {

        let params = new HttpParams()
            .set('page', request.page)
            .set('size', request.size)
            .set('sortBy', request.sortBy ?? 'createdAt')
            .set('direction', request.direction ?? 'DESC');

        return this.http.get<ApiResponse<PageResponse<EventDto>>>(
            this.apiUrl,
            { params }
        );
    }

    getEventById(
        eventId: string
    ): Observable<ApiResponse<EventDto>> {

        return this.http.get<ApiResponse<EventDto>>(
            `${this.apiUrl}/${eventId}`
        );
    }

    createEvent(
        eventData: CreateEventRequest,
        userId: string
    ): Observable<ApiResponse<EventDto>> {

        const params = new HttpParams()
            .set('userId', userId);

        return this.http.post<ApiResponse<EventDto>>(
            this.apiUrl,
            eventData,
            { params }
        );
    }

    updateEvent(
        eventId: string,
        eventData: UpdateEventRequest
    ): Observable<ApiResponse<EventDto>> {

        return this.http.put<
            ApiResponse<EventDto>>(
                `${this.apiUrl}/${eventId}`,
                eventData
            );
    }

    deleteEvent(
        eventId: string
    ): Observable<ApiResponse<void>> {

        return this.http.delete<
            ApiResponse<void>>(
                `${this.apiUrl}/${eventId}`
            );
    }

    searchEvents(
        searchTerm: string,
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<PageResponse<EventDto>>> {

        const params = new HttpParams()
            .set('searchTerm', searchTerm)
            .set('page', page)
            .set('size', size);

        return this.http.get<
            ApiResponse<PageResponse<EventDto>>>(
                `${this.apiUrl}/search`,
                { params }
            );
    }

    filterEvents(
        filters: EventFilters,
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<PageResponse<EventDto>>> {

        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (filters.title?.trim()) {
            params = params.set(
                'title',
                filters.title.trim()
            );
        }

        if (filters.startDateTime) {
            params = params.set(
                'startDateTime',
                filters.startDateTime
            );
        }

        if (filters.endDateTime) {
            params = params.set(
                'endDateTime',
                filters.endDateTime
            );
        }

        if (filters.location?.trim()) {
            params = params.set(
                'location',
                filters.location.trim()
            );
        }

        if (filters.minCapacity !== undefined) {
            params = params.set(
                'minCapacity',
                filters.minCapacity
            );
        }

        return this.http.get<
            ApiResponse<PageResponse<EventDto>>>(
                `${this.apiUrl}/filter`,
                { params }
            );
    }

    getUpcomingEvents(
        startDateTime: string,
        endDateTime: string,
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<PageResponse<EventDto>>> {

        const params = new HttpParams()
            .set('startDateTime', startDateTime)
            .set('endDateTime', endDateTime)
            .set('page', page)
            .set('size', size);

        return this.http.get<
            ApiResponse<PageResponse<EventDto>>>(
                `${this.apiUrl}/upcoming`,
                { params }
            );
    }

    getEventsByUser(
        userId: string,
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<PageResponse<EventDto>>> {

        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<
            ApiResponse<PageResponse<EventDto>>>(
                `${this.apiUrl}/user/${userId}`,
                { params }
            );
    }
}