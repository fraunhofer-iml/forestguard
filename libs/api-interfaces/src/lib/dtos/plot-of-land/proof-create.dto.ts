export class ProofCreateDto {
  type: string;
  documentRef: string;
  notice: string;

  constructor(type: string, documentRef: string, notice: string) {
    this.type = type;
    this.documentRef = documentRef;
    this.notice = notice;
  }
}
