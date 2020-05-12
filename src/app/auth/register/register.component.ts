import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  cargando = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }


  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {
    if ( this.registroForm.invalid ) { return; }


    /*Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });*/
    this.store.dispatch(isLoading());

    const { nombre, correo, password} = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password).then( credenciales => {
      console.log(credenciales);
      //Swal.close();
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
