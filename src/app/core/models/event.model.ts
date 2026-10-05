import { AuthUser } from "./auth.models";

export interface EventDto {
    id: string;
    title: string;
    description: string | null;
    dateTime: string;
    location: string;
    maxCapacity: number;
    createdBy: AuthUser;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventRequest {
    title: string;
    description: string | null;
    dateTime: string;
    location: string;
    maxCapacity: number;
}

export interface UpdateEventRequest {
    title: string;
    description: string | null;
    dateTime: string;
    location: string;
    maxCapacity: number;
}

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface EventFilters {
    title?: string;
    startDateTime?: string;
    endDateTime?: string;
    location?: string;
    minCapacity?: number;
}

export interface EventPageRequest {
    page: number;
    size: number;
    sortBy?: string;
    direction?: 'ASC' | 'DESC';
}