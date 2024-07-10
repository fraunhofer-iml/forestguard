import { FormControl } from '@angular/forms';

export interface PlotOfLandForm {
  processOwner: FormControl<string | null>;
  region: FormControl<string | null>;
  plotOfLand: FormControl<string | null>;
  sortOfCoffee: FormControl<string | null>;
  localPlotOfLandId: FormControl<string | null>;
  nationalPlotOfLandId: FormControl<string | null>;
  polygondata: FormControl<string | null>;
}
