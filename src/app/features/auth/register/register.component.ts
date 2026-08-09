import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject
} from '@angular/core';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  AuthService
} from '../../../core/services/auth.service';

import {
  ButtonModule
} from 'primeng/button';

import {
  CardModule
} from 'primeng/card';

import {
  InputTextModule
} from 'primeng/inputtext';

import {
  MessageModule
} from 'primeng/message';

import {
  PasswordModule
} from 'primeng/password';


@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink,

    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],

  templateUrl: './register.component.html'
})
export class RegisterComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);


  isLoading = false;

  errorMessage: string | null = null;


  readonly registerForm =
    this.fb.nonNullable.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });


  register(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }


    this.isLoading = true;

    this.errorMessage = null;


    this.authService
      .register(this.registerForm.getRawValue())
      .pipe(

        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({

        next: () => {

          this.router.navigate(['/events']);
        },

        error: (error: HttpErrorResponse) => {

          this.errorMessage =
            this.parseRegisterError(error);
        }
      });
  }


  isFieldInvalid(
    field:
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'password'
  ): boolean {

    const control =
      this.registerForm.controls[field];


    return control.invalid &&
      (control.dirty || control.touched);
  }


  getErrorMessage(
    field:
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'password'
  ): string {

    const control =
      this.registerForm.controls[field];


    if (control.hasError('required')) {

      switch (field) {

        case 'firstName':
          return 'Nome obbligatorio';

        case 'lastName':
          return 'Cognome obbligatorio';

        case 'email':
          return 'Email obbligatoria';

        case 'password':
          return 'Password obbligatoria';
      }
    }


    if (control.hasError('minlength')) {

      if (
        field === 'firstName' ||
        field === 'lastName'
      ) {
        return 'Inserisci almeno 2 caratteri';
      }


      if (field === 'password') {
        return 'La password deve avere almeno 8 caratteri';
      }
    }


    if (control.hasError('email')) {

      return 'Inserisci una email valida';
    }


    return '';
  }


  private parseRegisterError(
    error: HttpErrorResponse
  ): string {

    if (error.status === 409) {

      return 'Esiste già un account con questa email';
    }


    if (error.status === 400) {

      if (error.error?.message) {
        return error.error.message;
      }

      return 'I dati inseriti non sono validi';
    }


    if (error.error?.message) {

      return error.error.message;
    }


    return 'Errore durante la registrazione';
  }
}