import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
      console.log(this.cargando);
    });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch(isLoading());
    /*Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });*/

    const { email, password} = this.loginForm.value;
    this.authService.loginUsuario(email, password).then( credenciales => {
      console.log(credenciales);
      // Swal.close();
      this.store.dispatch( stopLoading() );
      this.router.navigate(['/']);
    }).catch( err => {
      console.error(err);
      this.store.dispatch( stopLoading() );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      });
    });
  }
}
