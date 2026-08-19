import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../services/chat-service';
import { Conversacion, Mensaje } from '../services/chat-model';

@Component({
  selector: 'app-chat-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-admin.html',
  styleUrl: './chat-admin.css',
})
export class ChatAdmin {
  private chatService = inject(ChatService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  conversaciones$: Observable<Conversacion[]> = this.chatService.obtenerConversaciones();

  conversacionActivaId: string | null = null;
  conversacionActivaNombre = '';
  mensajes$: Observable<Mensaje[]> | null = null;
  nuevoMensaje = '';

  goBack() {
    this.router.navigate(['/home']);
  }

  async seleccionar(conv: Conversacion) {
    this.conversacionActivaId = conv.id!;
    this.conversacionActivaNombre = conv.clienteNombre;
    this.mensajes$ = this.chatService.obtenerMensajes(conv.id!);
    await this.chatService.marcarComoLeido(conv.id!, 'admin');
    this.cdr.detectChanges();
  }

  async enviar() {
    const texto = this.nuevoMensaje.trim();
    if (!texto || !this.conversacionActivaId) return;

    await this.chatService.enviarMensaje(this.conversacionActivaId, 'admin', texto);
    this.nuevoMensaje = '';
    this.cdr.detectChanges();
  }
}