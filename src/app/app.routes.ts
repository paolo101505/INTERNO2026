import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Productos } from './pages/productos/productos';
import { AddProductos } from './pages/add-productos/add-productos';
import { Nosotros } from './pages/nosotros/nosotros';
import { ChatAdmin } from './pages/chat-admin/chat-admin';
import { ChatCliente } from './pages/chat-cliente/chat-cliente';
import { Perfil } from './pages/perfil/perfil';

import { adminGuard } from './pages/services/admin-guard';
import { authGuard } from './pages/services/auth-guard';

export const routes: Routes = [
  // Página pública
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'productos', component: Productos },
  { path: 'nosotros', component: Nosotros },

  // Solo administrador
  {
    path: 'add-productos',
    component: AddProductos,
    canActivate: [authGuard, adminGuard]
  },

  // Solo administrador
  {
    path: 'chat-admin',
    component: ChatAdmin,
    canActivate: [authGuard, adminGuard]
  },

  // Cualquier usuario autenticado
  {
    path: 'chat-cliente',
    component: ChatCliente,
    canActivate: [authGuard]
  },

  // Cualquier usuario autenticado
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard]
  },

  // Ruta por defecto
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // Cualquier ruta inexistente
  {
    path: '**',
    redirectTo: 'home'
  }
];