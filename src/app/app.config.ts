import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { enviroment } from '../environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(enviroment.firebase)),
    provideFirestore(() => getFirestore()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAuth(() => getAuth()),

  ]    
};
