import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NgxSonnerToaster } from 'ngx-sonner';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { CoreModule } from './core/core.module';
import { initializeKeycloak } from './init/keycloak-init.factory';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, BrowserModule, RouterModule.forRoot(appRoutes), NgxSonnerToaster, KeycloakAngularModule],
  providers: [
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
