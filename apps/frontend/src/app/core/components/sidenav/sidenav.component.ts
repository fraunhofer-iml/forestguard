import { switchMap } from 'rxjs';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CompanyService } from '../../../shared/services/company/company.service';
import { SharedReload } from '../../../shared/utils/sharedReload';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  version = environment.VERSION;
  company$ = SharedReload.reload2$.pipe(
    switchMap(() => this.companyService.getCompanyById(this.authenticationService.getCurrentCompanyId() ?? ''))
  );

  constructor(
    public authenticationService: AuthenticationService,
    private readonly companyService: CompanyService,
    private shade: SharedReload
  ) {
    this.company$.subscribe((company) => console.log(company));
    console.log(this.shade);
  }

  getCompanyAbbrevation(companyName: string): string {
    return companyName
      .split(' ')
      .map((word) => word[0])
      .join('');
  }
}
