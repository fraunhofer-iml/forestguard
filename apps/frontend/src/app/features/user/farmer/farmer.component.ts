import { FGFile, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { BehaviorSubject, combineLatest, firstValueFrom, lastValueFrom, map, Observable, startWith, switchMap } from 'rxjs';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Document } from '@prisma/client';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
})
export class FarmerComponent {
  company$ = this.companyService.getCompanyById(this.authenticationService.getCurrentCompanyId() ?? '');
  reload$ = new BehaviorSubject(undefined);
  farmer$: Observable<UserOrFarmerDto> = combineLatest([this.route.params, this.reload$]).pipe(
    switchMap(([params]) => this.userService.getUserById(params['id']))
  );

  protected readonly window = window;
  MINIO_URL = environment.MINIO.URL;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private companyService: CompanyService,
    public authenticationService: AuthenticationService
  ) {}

  deleteDocument(document: Document) {
    this.userService.deleteDocumentById(document.userId ?? '', document.documentRef).subscribe(() => this.reload$.next(undefined));
  }

  submitFile({ fgFile, farmerId }: { fgFile: FGFile; farmerId: string }): void {
    this.userService.addDocumentToUser(farmerId, fgFile.file, fgFile.documentType ?? '').subscribe(() => this.reload$.next(undefined));
  }
}
