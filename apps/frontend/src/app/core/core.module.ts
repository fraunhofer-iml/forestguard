/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ContentLayoutComponent } from './components/content-layout/content-layout.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AuthenticationService } from './services/authentication.service';

@NgModule({
  declarations: [SidenavComponent, ContentLayoutComponent],
  imports: [CommonModule, RouterModule, NgOptimizedImage, BrowserAnimationsModule, SharedModule],
  exports: [SidenavComponent, ContentLayoutComponent],
  providers: [AuthenticationService],
})
export class CoreModule {}
