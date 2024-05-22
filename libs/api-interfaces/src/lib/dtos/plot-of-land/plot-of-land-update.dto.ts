export class PlotOfLandUpdateDto {
  cultivatedWith?: string;

  constructor(cultivatedWith?: string) {
    this.cultivatedWith = cultivatedWith;
  }
}
