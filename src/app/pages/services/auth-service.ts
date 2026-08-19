import { Injectable, inject } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';

export interface Usuario {
  nombre: string;
  correo: string;
  rol: 'cliente' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);


  user$: Observable<User | null> = authState(this.auth);


  usuario$: Observable<Usuario | null> = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of(null);
      const ref = doc(this.firestore, `usuarios/${user.uid}`);
      return docData(ref) as Observable<Usuario>;
    })
  );
}
