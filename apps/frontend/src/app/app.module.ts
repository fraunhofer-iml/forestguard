import { NgxSonnerToaster } from 'ngx-sonner';
import { NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [AppComponent, SidenavComponent, ContentLayoutComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), MatToolbarModule, NgOptimizedImage, BrowserAnimationsModule, NgxSonnerToaster],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
