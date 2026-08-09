import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
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

  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  errorMessage = signal<string | undefined>(undefined);


  readonly loginForm =
    this.fb.nonNullable.group({

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


  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(undefined);


    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          const returnUrl =
            this.route.snapshot.queryParamMap
              .get('returnUrl');

          this.router.navigateByUrl(
            this.isValidReturnUrl(returnUrl)
              ? returnUrl!
              : '/events'
          );
        },

        error: (error: HttpErrorResponse) => {

          this.errorMessage.set(
            this.parseAuthError(error)
          );
        }
      });
  }


  isFieldInvalid(
    field: 'email' | 'password'
  ): boolean {

    const control =
      this.loginForm.controls[field];


    return control.invalid &&
      (control.dirty || control.touched);
  }


  getErrorMessage(
    field: 'email' | 'password'
  ): string {

    const control =
      this.loginForm.controls[field];


    if (control.hasError('required')) {

      return field === 'email'
        ? 'Email obbligatoria'
        : 'Password obbligatoria';
    }


    if (control.hasError('email')) {

      return 'Inserisci una email valida';
    }


    if (control.hasError('minlength')) {

      return 'La password deve avere almeno 8 caratteri';
    }


    return '';
  }


  private parseAuthError(
    error: HttpErrorResponse
  ): string {

    if (error.status === 401) {

      return 'Email o password non corretti';
    }


    if (error.status === 429) {

      return 'Troppi tentativi. Riprova più tardi';
    }


    if (error.error?.message) {

      return error.error.message;
    }


    return 'Errore durante il login';
  }


  private isValidReturnUrl(
    returnUrl: string | null
  ): boolean {

    if (!returnUrl) {
      return false;
    }

    return returnUrl.startsWith('/')
      && !returnUrl.startsWith('//');
  }
}