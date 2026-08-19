import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Productos } from './pages/productos/productos';
import { AddProductos } from './pages/add-productos/add-productos';
import { Nosotros } from './pages/nosotros/nosotros';
import { ChatAdmin } from './pages/chat-admin/chat-admin';
import { ChatCliente } from './pages/chat-cliente/chat-cliente';
import { adminGuard } from './pages/services/admin-guard';
import { authGuard } from './pages/services/auth-guard';


export const routes: Routes = [
    {path:'login',component:Login},
    {path:'home',component:Home},
    {path:'productos',component:Productos},
    {path:'add-productos',component:AddProductos},
    {path:'nosotros',component: Nosotros},
    {path:'chat-admin',component:ChatAdmin},
    {path:'chat-cliente',component:ChatCliente},
    {path: 'chat-admin', component: ChatAdmin, canActivate: [authGuard, adminGuard] },
    {path: 'chat-cliente', component: ChatCliente, canActivate: [authGuard] },

];
