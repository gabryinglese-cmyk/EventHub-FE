import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      replaceUrl: true
    });
  }
}
