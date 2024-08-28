import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { CultivationService } from '../../../shared/services/cultivation/cultivation.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { UserService } from '../../../shared/services/user/user.service';
import { AddPlotOfLandComponent } from './add-plot-of-land.component';
import { GeneratePlotOfLandService } from './service/generate-plot-of-land.service';

describe('AddPlotOfLandComponent', () => {
  let component: AddPlotOfLandComponent;
  let fixture: ComponentFixture<AddPlotOfLandComponent>;

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
    expect(component.plotOfLandFormGroup.contains('geoData')).toBeTruthy();
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
});
