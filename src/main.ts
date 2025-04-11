import { bootstrapApplication } from "@angular/platform-browser"
import { provideRouter } from "@angular/router"
import { AppComponent } from "./app/app.component"
import { routes } from "./app/app.routes"
import { provideAnimations } from "@angular/platform-browser/animations";
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker'

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimations(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })],
}).catch((err) => console.error(err))
