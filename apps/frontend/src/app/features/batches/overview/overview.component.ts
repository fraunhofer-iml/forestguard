import { BatchDto } from '@forest-guard/api-interfaces';
import { map, Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { getUserOrCompanyName } from '../../../shared/utils/user-company-utils';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class BatchOverviewComponent implements AfterViewInit {
  displayedColumnsOfBatches: string[] = ['select', 'batchId', 'process', 'date', 'processOwner', 'weight'];
  dataSource: MatTableDataSource<BatchDto> = new MatTableDataSource<BatchDto>();
  selection = new SelectionModel<BatchDto>(true, []);
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

  constructor(private companyService: CompanyService, private router: Router, private authenticationService: AuthenticationService) {}

  ngAfterViewInit(): void {
    this.getBatches();
    this.dataSource.sortingDataAccessor = this.pathDataAccessor;
    this.dataSource.filterPredicate = this.filterPredicate;
  }

  getBatches() {
    this.batches$ = this.companyService
      .getBatchesOfCompany(this.authenticationService.getCurrentCompanyId() ?? '', '{"active": true}')
      .pipe(
        map((batches) => {
          batches.reverse();
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BatchDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  routeToAddProcess(): void {
    const selectedBatchesString = this.selection.selected.map((batch) => batch.id).join(',');
    this.router.navigateByUrl(`/batches/update?batchIds=${selectedBatchesString}`);
  }
}
