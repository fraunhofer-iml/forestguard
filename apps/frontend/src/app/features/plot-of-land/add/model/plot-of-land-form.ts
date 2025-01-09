import { UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { FormControl } from '@angular/forms';

export interface PlotOfLandForm {
  processOwner: FormControl<string | UserOrFarmerDto | null>;
  region: FormControl<string | null>;
  plotOfLand: FormControl<string | null>;
  cultivationSort: FormControl<string | null>;
  cultivationQuality: FormControl<string | null>;
  localPlotOfLandId: FormControl<string | null>;
  nationalPlotOfLandId: FormControl<string | null>;
}
