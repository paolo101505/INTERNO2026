import { Timestamp } from '@angular/fire/firestore';
 
export interface Mensaje {
  id?: string;
  remitente: 'cliente' | 'admin';
  texto: string;
  fecha: Timestamp;
}
 
export interface Conversacion {
  id?: string;
  clienteId: string;
  clienteNombre: string;
  ultimoMensaje: string;
  ultimaFecha: Timestamp;
  noLeidosAdmin: number;   
  noLeidosCliente: number; 
}