import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddUserComponent } from './add/add-user.component';
import { FarmerComponent } from './farmer/farmer.component';

export const userRoutes: Route[] = [
  {
    path: 'add',
    component: AddUserComponent,
  },
  {
    path: ':id',
    component: FarmerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
