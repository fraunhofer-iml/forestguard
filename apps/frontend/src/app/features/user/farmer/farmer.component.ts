import { UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { map, Observable, switchMap } from 'rxjs';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
})
export class FarmerComponent {
  id$ = this.route.params?.pipe(map((params) => params['id']));
  farmer$: Observable<UserOrFarmerDto> = this.id$?.pipe(switchMap((id) => this.userService.getUserById(id)));
  company$ = this.companyService.getCompanyById(this.authenticationService.getCurrentCompanyId() ?? '');
  protected readonly window = window;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private companyService: CompanyService,
    public authenticationService: AuthenticationService
  ) {}
}
