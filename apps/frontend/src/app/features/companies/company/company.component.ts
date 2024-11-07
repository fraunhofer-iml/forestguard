import { CompanyDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { ImportService } from '../../../shared/services/import/import.service';
import { Uris } from '../../../shared/uris';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
})
export class CompanyComponent {
  id$ = this.route.params.pipe(map((params) => params['id']));
  company$: Observable<CompanyDto> = this.id$.pipe(
    switchMap((id) =>
      this.companyService.getCompanyById(id).pipe(
        catchError((error: HttpErrorResponse) => {
          toast.error(error.error.message);
          return EMPTY;
        })
      )
    )
  );
  displayedColumnsOfBatches: string[] = [
    'employeeId',
    'name',
    'email',
    'mobilePhoneNumber',
    'street',
    'postalCode',
    'city',
    'state',
    'country',
    'plotOfLand',
  ];
  dataSource: MatTableDataSource<UserOrFarmerDto> = new MatTableDataSource<UserOrFarmerDto>();
  farmers$?: Observable<MatTableDataSource<UserOrFarmerDto>>;
  paginator?: MatPaginator;
  sort?: MatSort;

  protected readonly Uris = Uris;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private importService: ImportService
  ) {
    this.getFarmers();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  }

  getFarmers() {
    this.farmers$ = this.company$.pipe(
      map((company) => {
        this.dataSource = new MatTableDataSource<UserOrFarmerDto>(company.farmers ?? []);
        return this.dataSource;
      })
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const formData = new FormData();
      formData.append('file', input.files[0]);
      this.importService
        .importMasterData(formData)
        .pipe(
          catchError(() => {
            toast.error(Messages.errorMasterDataImport);
            return EMPTY;
          })
        )
        .subscribe(() => {
          toast.success(Messages.successMasterDataImport);
        });
    }
  }
}
