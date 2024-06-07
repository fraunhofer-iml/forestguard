import { BatchDto } from '@forrest-guard/api-interfaces';
import { map, Observable } from 'rxjs';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { COMPANY_ID } from '../../../shared/constants';
import { CompanyService } from '../../../shared/services/company/company.service';
import { getUserOrCompanyName } from '../../../shared/utils/user-company-utils';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class BatchOverviewComponent implements AfterViewInit {
  displayedColumnsOfBatches: string[] = ['batchId', 'weight', 'process', 'date', 'processOwner'];
  dataSource: MatTableDataSource<BatchDto> = new MatTableDataSource<BatchDto>();
  paginator?: MatPaginator;
  sort?: MatSort;
  batches$?: Observable<MatTableDataSource<BatchDto>>;
  getUserOrCompanyName = getUserOrCompanyName;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(private companyService: CompanyService) {}

  ngAfterViewInit(): void {
    this.getBatches();
    this.dataSource.sortingDataAccessor = this.pathDataAccessor;
    this.dataSource.filterPredicate = this.filterPredicate;
  }

  getBatches() {
    this.batches$ = this.companyService.getBatchesOfCompany(COMPANY_ID).pipe(
      map((batches) => {
        const dataSource = this.dataSource;
        dataSource.data = batches;
        return dataSource;
      })
    );
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * The algorithm for sorting the table. It uses the defined mat-sort-header to get deeper into object in order
   * to sort for nested properties.
   * @param item - The html item
   * @param path - The material sort header
   * @returns The objects in the sorted way
   */
  pathDataAccessor(item: any, path: string): any {
    return path.split('.').reduce((accumulator: any, key: string) => {
      return accumulator ? accumulator[key] : undefined;
    }, item);
  }

  /**
   * Filters all attributes, if the filter string can be found
   * @param ead the ead
   * @param filter the string to filter for
   * @returns found or not found
   */
  filterPredicate(ead: BatchDto, filter: string): boolean {
    const transformedFilter = filter.trim().toLowerCase();

    const listAsFlatString = (obj: any): string => {
      let returnVal = '';
      Object.values(obj).forEach((val) => {
        if (typeof val !== 'object') {
          returnVal = returnVal + ' ' + val;
        } else if (val !== null) {
          returnVal = returnVal + ' ' + listAsFlatString(val);
        }
      });
      return returnVal.trim().toLowerCase();
    };

    return listAsFlatString(ead).includes(transformedFilter);
  }
}
