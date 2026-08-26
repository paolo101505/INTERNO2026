import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router,} from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-productos',
  imports: [CommonModule,],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class Productos implements OnInit {
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  allProducts: any[] = [];
  products: any[] = [];
  esAdmin = false;
  categoriaActiva: string | null = null;

  private nombresCategoria: Record<string, string> = {
    plantas: 'Plantas',
    adornos: 'Adornos',
    temporada: 'Artesanías de temporada',
  };

  async ngOnInit() {
    this.allProducts = await this.firestoreService.getAll('productos');

    const perfil = await firstValueFrom(this.authService.usuario$);
    this.esAdmin = perfil?.rol === 'admin';

    // Escucha cambios en ?categoria=... de la URL (ej. /productos?categoria=plantas)
    this.route.queryParamMap.subscribe((params) => {
      this.categoriaActiva = params.get('categoria');
      this.aplicarFiltro();
      this.cdr.detectChanges();
    });
  }

  private aplicarFiltro() {
    if (!this.categoriaActiva) {
      this.products = this.allProducts;
    } else {
      this.products = this.allProducts.filter(
        (p) => p.categoria === this.categoriaActiva
      );
    }
  }

  nombreCategoria(): string {
    if (!this.categoriaActiva) return 'Todos los productos';
    return this.nombresCategoria[this.categoriaActiva] ?? this.categoriaActiva;
  }

  addProductos() {
    this.router.navigate(['/add-productos']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}