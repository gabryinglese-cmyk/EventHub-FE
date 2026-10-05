import { AuthUser } from './auth.models';
import { EventDto } from './event.model';


export type BookingStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED';


export interface BookingDto {

    id: string;

    event: EventDto;

    user: AuthUser;

    numberOfTickets: number;

    status: BookingStatus;

    createdAt: string;

    updatedAt: string;

}


export interface CreateBookingRequest {

    eventId: string;

    userId: string;

    numberOfTickets: number;

}