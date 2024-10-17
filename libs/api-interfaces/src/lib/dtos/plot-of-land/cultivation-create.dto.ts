export class CultivationCreateDto {
  sort: string;
  quality: string;

  constructor(sort: string, quality: string) {
    this.sort = sort;
    this.quality = quality;
  }
}
