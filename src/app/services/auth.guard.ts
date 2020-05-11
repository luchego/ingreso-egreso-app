import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authSevice: AuthService,
              private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authSevice.isAuth().pipe(
      tap( estado => {
        if ( !estado ) { this.router.navigate(['/login']); }
      })
    );
  }

}
