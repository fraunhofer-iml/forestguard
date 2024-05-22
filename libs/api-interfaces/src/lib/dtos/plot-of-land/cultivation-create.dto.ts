export class CultivationCreateDto {
  type: string;
  sort: string;

  constructor(type: string, sort: string) {
    this.type = type;
    this.sort = sort;
  }
}
