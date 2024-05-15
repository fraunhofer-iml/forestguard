import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { NgOptimizedImage } from '@angular/common';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ContentLayoutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatToolbarModule,
    NgOptimizedImage,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
