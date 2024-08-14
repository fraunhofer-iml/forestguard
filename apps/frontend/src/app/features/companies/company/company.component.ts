import { CompanyDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../shared/services/company/company.service';

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
    'farmerId',
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

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  constructor(private route: ActivatedRoute, private companyService: CompanyService) {
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
}
