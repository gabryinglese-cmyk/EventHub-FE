import { Routes } from '@angular/router';
import { publicGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { NotFoundComponent } from './features/not-found/not-found.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  {
    path: 'auth',
    children: [

      {
        path: 'login',
        component: LoginComponent,
        canActivate: [publicGuard]
      },

      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [publicGuard]
      }

    ]
  },

  {
    path: '**',
    component: NotFoundComponent
  }

];