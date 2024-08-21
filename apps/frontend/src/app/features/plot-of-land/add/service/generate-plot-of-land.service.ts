import { PlotOfLandCreateDto } from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';

export class GeneratePlotOfLandService {
  public createNewPlotOfLand(formGroup: FormGroup): PlotOfLandCreateDto {
    return new PlotOfLandCreateDto(
      '',
      formGroup.value.region ?? '',
      '',
      formGroup.value.plotOfLand ?? '',
      formGroup.value.geoData ?? '',
      0,
      formGroup.value.cultivatedWith ?? '',
      formGroup.value.nationalPlotOfLandId ?? '',
      formGroup.value.localPlotOfLandId ?? ''
    );
  }
}
