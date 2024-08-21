import { FormControl } from '@angular/forms';

export interface PlotOfLandForm {
  processOwner: FormControl<string | null>;
  region: FormControl<string | null>;
  plotOfLand: FormControl<string | null>;
  cultivatedWith: FormControl<string | null>;
  localPlotOfLandId: FormControl<string | null>;
  nationalPlotOfLandId: FormControl<string | null>;
  geoData: FormControl<string | null>;
}
