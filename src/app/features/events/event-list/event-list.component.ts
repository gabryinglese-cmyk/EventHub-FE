import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import {
  debounceTime,
  distinctUntilChanged,
  finalize
} from 'rxjs';

import {
  EventDto,
  EventFilters,
  PageResponse
} from '../../../core/models/event.model';

import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';

import { EventCardComponent } from '../event-card/event-card.component';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';


@Component({
  selector: 'app-event-list',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    FormsModule,

    ButtonModule,
    CardModule,
    InputTextModule,
    DatePickerModule,
    InputNumberModule,
    TagModule,
    ProgressSpinnerModule,
    PaginatorModule,
    MessageModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule,

    EventDialogComponent,
    EventCardComponent
  ],

  providers: [
    MessageService,
    ConfirmationService
  ],

  templateUrl: './event-list.component.html'
})
export class EventListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  readonly events = signal<EventDto[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | undefined>(undefined);
  readonly currentPage = signal(0);
  readonly pageSize = signal(3);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly showFilters = signal(false);
  readonly showEventDialog = signal(false);
  readonly selectedEvent = signal<EventDto | null>(null);


  readonly searchForm =
    this.fb.nonNullable.group({
      searchTerm: ''
    });


  readonly filterForm =
    this.fb.nonNullable.group({
      title: '',
      location: '',
      minCapacity: 0,
      startDateTime:
        null as Date | null,
      endDateTime:
        null as Date | null

    });

  readonly sortOptions = [
    {
      label: 'Più recenti',
      value: 'createdAt,DESC'
    },

    {
      label: 'Data evento',
      value: 'dateTime,ASC'
    },

    {
      label: 'Titolo',
      value: 'title,ASC'
    }

  ];

  readonly selectedSort = signal('createdAt,DESC');

  constructor() {
    this.setupSearch();
    this.loadEvents();
  }


  private setupSearch(): void {
    this.searchForm.controls.searchTerm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(
        this.destroyRef
      )
    )
      .subscribe(searchTerm => {
        this.currentPage.set(0);

        if (!searchTerm.trim()) {
          this.loadEvents();
          return;
        }

        this.searchEvents(searchTerm.trim());

      });

  }

  loadEvents(): void {
    this.isLoading.set(true);
    this.errorMessage.set(undefined);
    const [sortBy, direction] = this.selectedSort().split(',');

    this.eventService.getAllEvents({

      page:
        this.currentPage(),

      size:
        this.pageSize(),

      sortBy,

      direction:
        direction as 'ASC' | 'DESC'

    })
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: response => {
          const page =
            response.data;
          this.updatePage(page);
        },
        error: error => {
          this.errorMessage.set(
            error?.error?.message ??
            'Impossibile caricare gli eventi.'
          );
        }
      });
  }

  private searchEvents(searchTerm: string): void {

    this.isLoading.set(true);
    this.errorMessage.set(undefined);

    this.eventService
      .searchEvents(
        searchTerm,
        this.currentPage(),
        this.pageSize()
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(() => {

          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: response => {
          this.updatePage(
            response.data
          );
        },
        error: error => {
          this.errorMessage.set(
            error?.error?.message ??
            'Errore durante la ricerca.'
          );
        }
      });
  }


  applyFilters(): void {
    const form = this.filterForm.getRawValue();
    const filters: EventFilters = {
      title:
        form.title || undefined,
      location:
        form.location || undefined,
      minCapacity:
        form.minCapacity > 0
          ? form.minCapacity
          : undefined,
      startDateTime:
        form.startDateTime
          ? this.toLocalDateTimeString(
            form.startDateTime
          )
          : undefined,
      endDateTime:
        form.endDateTime
          ? this.toLocalDateTimeString(
            form.endDateTime
          )
          : undefined

    };

    this.currentPage.set(0);
    this.isLoading.set(true);
    this.errorMessage.set(undefined);

    this.eventService
      .filterEvents(
        filters,
        0,
        this.pageSize()
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: response => {
          this.updatePage(
            response.data
          );
        },

        error: error => {
          console.error(
            '[EVENT FILTER] Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Errore durante il filtraggio.'

          );
        }
      });
  }

  private toLocalDateTimeString(date: Date): string {
    const pad =
      (value: number): string =>
        value
          .toString()
          .padStart(2, '0');

    return [
      date.getFullYear(),
      '-',
      pad(date.getMonth() + 1),
      '-',
      pad(date.getDate()),
      'T',
      pad(date.getHours()),
      ':',
      pad(date.getMinutes()),
      ':',
      pad(date.getSeconds())
    ].join('');

  }

  resetFilters(): void {

    this.filterForm.reset({
      title: '',
      location: '',
      minCapacity: 0,
      startDateTime: null,
      endDateTime: null
    });

    this.searchForm.reset({ searchTerm: '' });
    this.currentPage.set(0);
    this.loadEvents();
  }


  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.page ?? 0);

    this.pageSize.set(event.rows ?? 3);
    this.loadEvents();
  }

  onSortChange(value: string): void {
    this.selectedSort.set(value);
    this.currentPage.set(0);
    this.loadEvents();
  }

  openCreateDialog(): void {
    this.selectedEvent.set(null);
    this.showEventDialog.set(true);
  }

  openEditDialog(event: EventDto): void {
    this.selectedEvent.set(event);
    this.showEventDialog.set(true);
  }

  closeDialog(): void {
    this.showEventDialog.set(false);
    this.selectedEvent.set(null);
  }

  onEventSaved(): void {
    this.closeDialog();
    this.messageService.add({
      severity:
        'success',
      summary:
        'Evento salvato',
      detail:
        'L\'evento è stato salvato correttamente.'
    });
    this.loadEvents();
  }


  viewDetails(
    eventId: string
  ): void {
    this.router.navigate([
      '/events',
      eventId
    ]);
  }

  deleteEvent(event: EventDto): void {
    this.confirmationService.confirm({
      message:
        `Sei sicuro di voler eliminare "${event.title}"?`,

      header:
        'Conferma eliminazione',

      icon:
        'pi pi-exclamation-triangle',

      acceptLabel:
        'Elimina',

      rejectLabel:
        'Annulla',

      acceptButtonStyleClass:
        'p-button-danger',

      accept: () => {
        this.eventService
          .deleteEvent(
            event.id
          )
          .pipe(
            takeUntilDestroyed(
              this.destroyRef
            )
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity:
                  'success',
                summary:
                  'Evento eliminato',
                detail:
                  'L\'evento è stato eliminato.'
              });
              this.loadEvents();
            },

            error: error => {
              this.messageService.add({
                severity:
                  'error',
                summary:
                  'Errore',
                detail:
                  error?.error?.message ??
                  'Impossibile eliminare l\'evento.'
              });
            }
          });
      }
    });
  }

  onLogout(): void {
    this.authService
      .logout()
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe({
        next: () => {
          this.router.navigate([
            '/auth/login'
          ]);
        },
        error: () => {
          this.router.navigate([
            '/auth/login'
          ]);
        }
      });
  }

  private updatePage(page: PageResponse<EventDto>): void {

    this.events.set(
      page.content
    );

    this.totalElements.set(
      page.totalElements
    );

    this.totalPages.set(
      page.totalPages
    );
  }
}