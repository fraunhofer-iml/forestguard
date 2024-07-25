import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiGraphComponent } from './ui-graph.component';

describe('UiGraphComponent', () => {
  let component: UiGraphComponent;
  let fixture: ComponentFixture<UiGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
