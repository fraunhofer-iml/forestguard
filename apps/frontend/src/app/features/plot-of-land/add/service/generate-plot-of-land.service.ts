import { GeoDataDto, PlotOfLandCreateDto } from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';

export class GeneratePlotOfLandService {
  public createGeoData(formGroup: FormGroup): GeoDataDto {
    return new GeoDataDto(
      formGroup.value.geoDataStandard ?? '',
      formGroup.value.geoDataType ?? '',
      formGroup.value.geoDataCoordinate ?? '',
      formGroup.value.geoDataZone ?? ''
    );
  }

  public createNewPlotOfLand(formGroup: FormGroup): PlotOfLandCreateDto {
    return new PlotOfLandCreateDto(
      '',
      formGroup.value.region ?? '',
      '',
      formGroup.value.plotOfLand ?? '',
      this.createGeoData(formGroup),
      0,
      formGroup.value.cultivatedWith ?? '',
      formGroup.value.nationalPlotOfLandId ?? '',
      formGroup.value.localPlotOfLandId ?? ''
    );
  }
}
