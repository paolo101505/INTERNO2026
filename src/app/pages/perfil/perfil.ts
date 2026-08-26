import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Auth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private authService = inject(AuthService);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  perfilForm: FormGroup;
  guardando = false;
  cargando = true;

  constructor(private formBuilder: FormBuilder) {
    this.perfilForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasenaActual: [''],
      contrasenaNueva: [''],
    });
  }

  async ngOnInit() {
    const perfil = await firstValueFrom(this.authService.usuario$);

    if (perfil) {
      this.perfilForm.patchValue({
        nombre: perfil.nombre,
        correo: perfil.correo,
      });
    }

    this.cargando = false;
    this.cdr.detectChanges();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async guardarCambios() {
    const user = this.auth.currentUser;
    if (!user) return;

    const { nombre, correo, contrasenaActual, contrasenaNueva } = this.perfilForm.value;

    const cambiaCorreo = correo !== user.email;
    const cambiaContrasena = !!contrasenaNueva;

    // Firebase exige haber iniciado sesión "recientemente" para cambios sensibles,
    // así que pedimos la contraseña actual y reautenticamos antes de aplicar cambios.
    if ((cambiaCorreo || cambiaContrasena) && !contrasenaActual) {
      alert('Escribe tu contraseña actual para confirmar los cambios de correo o contraseña');
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    try {
      if (cambiaCorreo || cambiaContrasena) {
        const credential = EmailAuthProvider.credential(user.email!, contrasenaActual);
        await reauthenticateWithCredential(user, credential);
      }

      if (cambiaCorreo) {
        await updateEmail(user, correo);
      }

      if (cambiaContrasena) {
        await updatePassword(user, contrasenaNueva);
      }

      // El nombre y correo también se guardan en Firestore, para mantenerlos sincronizados
      await updateDoc(doc(this.firestore, 'usuarios', user.uid), {
        nombre,
        correo,
      });

      alert('Perfil actualizado correctamente');
      this.perfilForm.patchValue({ contrasenaActual: '', contrasenaNueva: '' });
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar. Revisa tu contraseña actual e intenta de nuevo.');
    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }
}