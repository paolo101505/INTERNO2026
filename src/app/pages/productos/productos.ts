import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class Productos implements OnInit {
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  esAdmin = false;

  async ngOnInit() {
    this.products = await this.firestoreService.getAll('productos');

    const perfil = await firstValueFrom(this.authService.usuario$);
    this.esAdmin = perfil?.rol === 'admin';

    this.cdr.detectChanges();
  }

  addProductos() {
    this.router.navigate(['/add-productos']);
  }
}