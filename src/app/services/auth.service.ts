import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubcription: Subscription;

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      if (fuser) {
        this.userSubcription = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
        .subscribe( (firestoreUser: any) => {
          console.log(firestoreUser);
          // const tempUser = new Usuario('abc', 'borrame', 'asasas@asada.com');
          const user = Usuario.fromFirebase(firestoreUser);
          this.store.dispatch(authActions.setUser({ user }));
        });
      } else {
        this.userSubcription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
    .then( ({ user }) => {
      const newUser = new Usuario(user.uid, nombre, user.email);

      return this.firestore.doc(`${ user.uid}/usuario`)
      .set({ ...newUser});
    });
  }

  loginUsuario(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map(
      fbUser => fbUser !== null
    ));
  }
}
