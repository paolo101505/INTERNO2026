import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);
  private authService = inject(AuthService);

  async irAlChat() {
    const perfil = await firstValueFrom(this.authService.usuario$);

    if (perfil?.rol === 'admin') {
      this.router.navigate(['/chat-admin']);
    } else {
      this.router.navigate(['/chat-cliente']);
    }
  }
}
