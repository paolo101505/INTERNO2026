import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { ChatService } from '../services/chat-service';
import { Mensaje } from '../services/chat-model';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-chat-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-cliente.html',
  styleUrl: './chat-cliente.css',
})
export class ChatCliente implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  conversacionId = '';
  mensajes$: Observable<Mensaje[]> | null = null;
  nuevoMensaje = '';
  cargando = true;

  goBack() {
    this.router.navigate(['/home']);
  }

  async ngOnInit() {
    const user = await firstValueFrom(this.authService.user$);
    const perfil = await firstValueFrom(this.authService.usuario$);

    if (!user || !perfil) {
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.conversacionId = await this.chatService.obtenerOCrearConversacion(
      user.uid,
      perfil.nombre
    );

    this.mensajes$ = this.chatService.obtenerMensajes(this.conversacionId);
    await this.chatService.marcarComoLeido(this.conversacionId, 'cliente');
    this.cargando = false;
    this.cdr.detectChanges();
  }

  async enviar() {
    const texto = this.nuevoMensaje.trim();
    if (!texto || !this.conversacionId) return;

    await this.chatService.enviarMensaje(this.conversacionId, 'cliente', texto);
    this.nuevoMensaje = '';
    this.cdr.detectChanges();
  }
}