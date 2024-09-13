import { toast } from 'ngx-sonner';
import { take, tap } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { CultivationService } from '../../../shared/services/cultivation/cultivation.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { UserService } from '../../../shared/services/user/user.service';
import { AddPlotOfLandComponent } from './add-plot-of-land.component';
import { GeneratePlotOfLandService } from './service/generate-plot-of-land.service';

jest.mock('ngx-sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('AddPlotOfLandComponent', () => {
  let component: AddPlotOfLandComponent;
  let fixture: ComponentFixture<AddPlotOfLandComponent>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPlotOfLandComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatAutocompleteModule],
      providers: [
        PlotOfLandService,
        CompanyService,
        HttpClient,
        HttpHandler,
        FormBuilder,
        UserService,
        CultivationService,
        GeneratePlotOfLandService,
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentCompanyId: jest.fn().mockReturnValue(''),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPlotOfLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    formBuilder = TestBed.inject(FormBuilder);
    formGroup = formBuilder.group({
      polygondataZone: [{ value: '', disabled: false }],
      polygondataType: [{ value: '', disabled: false }],
      polygondataCoordinate: [{ value: '', disabled: false }],
      polygondataStandard: [''],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.plotOfLandFormGroup.contains('processOwner')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('region')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('plotOfLand')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('cultivatedWith')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('localPlotOfLandId')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('nationalPlotOfLandId')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('geoDataInput')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('geoDataStandard')).toBeTruthy();
  });

  it('should have form invalid when empty', () => {
    expect(component.plotOfLandFormGroup.valid).toBeFalsy();
  });

  it('should mark all controls as touched', () => {
    component.submitPlotOfLand();

    Object.keys(component.plotOfLandFormGroup.controls).forEach((key) => {
      const control = component.plotOfLandFormGroup.get(key);
      expect(control?.touched).toBeTruthy();
    });
  });

  it('should clear input fields', () => {
    component.clearInputFields();

    expect(component.plotOfLandFormGroup.pristine).toBe(true);
    expect(component.plotOfLandFormGroup.untouched).toBe(true);
  });

  it('should handle file upload correctly', () => {
    const file = new File([], 'test.pdf');
    component.submitFile({ file, documentType: 'PROOF_OF_OWNERSHIP' });
    expect(component.uploadSelectOption.find((option) => option.value === 'PROOF_OF_OWNERSHIP')?.file).toBe(file);
  });

  it('should enable specific fields based on value change to "UTM"', () => {
    (component as any).enableFieldsByValueChange(formGroup);

    formGroup.get('polygondataStandard')?.setValue('UTM');
    formGroup
      .get('polygondataStandard')
      ?.valueChanges.pipe(
        take(1),
        tap(() => {
          expect(formGroup.get('polygondataZone')?.enabled).toBe(true);
          expect(formGroup.get('polygondataType')?.enabled).toBe(true);
          expect(formGroup.get('polygondataCoordinate')?.enabled).toBe(true);
        })
      )
      .subscribe();
  });

  it('should parse valid geoDataInput and update form values', () => {
    component.plotOfLandFormGroup.get('geoDataInput')?.setValue(
      JSON.stringify({
        geometry: {
          coordinates: [[1, 2, 3]],
          type: 'MultiPoint',
        },
      })
    );
    component.saveGeoData();

    expect(component.plotOfLandFormGroup.get('geoDataStandard')?.value).toBe('WGS');
    expect(component.plotOfLandFormGroup.get('geoDataCoordinate')?.value).toBe('[1,2,3]');
    expect(component.plotOfLandFormGroup.get('geoDataType')?.value).toBe('MultiPoint');
    expect(component.isImportGeoDataVisible).toBe(false);
  });

  it('should toggle openImportGeoData from true to false', () => {
    component.isImportGeoDataVisible = true;
    component.toggleImportGeoData();

    expect(component.isImportGeoDataVisible).toBe(false);
  });

  it('should show error toast when geoData is invalid JSON', () => {
    const invalidJson = 'invalid json';
    component.plotOfLandFormGroup.get('geoDataInput')?.setValue(invalidJson);
    component.saveGeoData();

    expect(toast.error).toHaveBeenCalledWith(Messages.invalidGeoData);
  });
});
