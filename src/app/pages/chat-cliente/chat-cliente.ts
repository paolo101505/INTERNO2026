
import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, ElementRef, ViewChild, inject } from '@angular/core';
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
export class ChatCliente implements OnInit, AfterViewChecked {
  @ViewChild('chatBody') private chatBodyRef?: ElementRef<HTMLDivElement>;
 
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
 
  // Se ejecuta cada vez que la vista termina de dibujarse (incluye cuando llegan mensajes nuevos)
  ngAfterViewChecked() {
    this.scrollAlFinal();
  }
 
  private scrollAlFinal() {
    if (!this.chatBodyRef) return;
    const el = this.chatBodyRef.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
 
  // Convierte el Timestamp de Firestore a una hora legible, ej. "14:32"
  formatearHora(fecha: any): string {
    if (!fecha) return '';
    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  }
 
  async enviar() {
    const texto = this.nuevoMensaje.trim();
    if (!texto || !this.conversacionId) return;
 
    await this.chatService.enviarMensaje(this.conversacionId, 'cliente', texto);
    this.nuevoMensaje = '';
    this.cdr.detectChanges();
  }
}
 