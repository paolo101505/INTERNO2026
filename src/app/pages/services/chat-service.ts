import { Injectable, inject } from '@angular/core';
import {Firestore, collection, collectionData, doc, docData,addDoc, updateDoc, query, where, orderBy, getDocs,serverTimestamp, increment} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Conversacion, Mensaje } from './chat-model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private firestore = inject(Firestore);

  async obtenerOCrearConversacion(clienteId: string, clienteNombre: string): Promise<string> {
    const ref = collection(this.firestore, 'conversaciones');
    const q = query(ref, where('clienteId', '==', clienteId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      return snap.docs[0].id;
    }

    const nuevaConv = await addDoc(ref, {
      clienteId,
      clienteNombre,
      ultimoMensaje: '',
      ultimaFecha: serverTimestamp(),
      noLeidosAdmin: 0,
      noLeidosCliente: 0,
    });
    return nuevaConv.id;
  }


  obtenerConversaciones(): Observable<Conversacion[]> {
    const ref = collection(this.firestore, 'conversaciones');
    const q = query(ref, orderBy('ultimaFecha', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Conversacion[]>;
  }

  obtenerConversacion(conversacionId: string): Observable<Conversacion> {
    const ref = doc(this.firestore, `conversaciones/${conversacionId}`);
    return docData(ref, { idField: 'id' }) as Observable<Conversacion>;
  }



  obtenerMensajes(conversacionId: string): Observable<Mensaje[]> {
    const ref = collection(this.firestore, `conversaciones/${conversacionId}/mensajes`);
    const q = query(ref, orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Mensaje[]>;
  }

  async enviarMensaje(conversacionId: string, remitente: 'cliente' | 'admin', texto: string) {
    const mensajesRef = collection(this.firestore, `conversaciones/${conversacionId}/mensajes`);
    await addDoc(mensajesRef, {
      remitente,
      texto,
      fecha: serverTimestamp(),
    });

    const convRef = doc(this.firestore, `conversaciones/${conversacionId}`);
    await updateDoc(convRef, {
      ultimoMensaje: texto,
      ultimaFecha: serverTimestamp(),
      ...(remitente === 'cliente'
        ? { noLeidosAdmin: increment(1) }
        : { noLeidosCliente: increment(1) }),
    });
  }

  async marcarComoLeido(conversacionId: string, rol: 'cliente' | 'admin') {
    const convRef = doc(this.firestore, `conversaciones/${conversacionId}`);
    await updateDoc(convRef, {
      ...(rol === 'admin' ? { noLeidosAdmin: 0 } : { noLeidosCliente: 0 }),
    });
  }
}