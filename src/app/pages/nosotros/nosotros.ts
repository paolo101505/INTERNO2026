import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-nosotros',
  imports: [],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css',
})
export class Nosotros {
  private router = inject(Router);
  private authService = inject(AuthService);
  goBack() {
    this.router.navigate(['/home']);
  }

   async irAlChat() {
      const perfil = await firstValueFrom(this.authService.usuario$);
  
      if (perfil?.rol === 'admin') {
        this.router.navigate(['/chat-admin']);
      } else {
        this.router.navigate(['/chat-cliente']);
      }
    }
}
