import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from './auth-service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.usuario$.pipe(
    take(1),
    map((usuario) => {
      if (usuario?.rol === 'admin') return true;

      router.navigate(['/home']); // no es admin -> lo mandamos al home normal
      return false;
    })
  );
};