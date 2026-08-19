import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  mostrarRegistro = true;
  cargando = false;
 
  loginForm: FormGroup;
  registroForm: FormGroup;
 
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
 
  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
    });
 
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
 
  mostrarTab(tab: 'login' | 'registro') {
    this.mostrarRegistro = tab === 'registro';
  }
 
  async iniciarSesion() {
    if (this.loginForm.invalid) {
      alert('Completa correo y contraseña');
      return;
    }
 
    this.cargando = true;
    try {
      const { correo, contrasena } = this.loginForm.value;
      await signInWithEmailAndPassword(this.auth, correo, contrasena);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
      alert('Correo o contraseña incorrectos');
    } finally {
      this.cargando = false;
    }
  }
 
  async crearCuenta() {
    if (this.registroForm.invalid) {
      alert('Completa todos los campos (la contraseña debe tener al menos 6 caracteres)');
      return;
    }
 
    this.cargando = true;
    try {
      const { nombre, correo, contrasena } = this.registroForm.value;
 

      const credenciales = await createUserWithEmailAndPassword(this.auth, correo, contrasena);
      const uid = credenciales.user.uid;

      await setDoc(doc(this.firestore, 'usuarios', uid), {
        nombre,
        correo,
        rol: 'cliente',
      });
 
      this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
      alert('No se pudo crear la cuenta. Verifica los datos o intenta con otro correo.');
    } finally {
      this.cargando = false;
    }
  }
}
 