export class ProofDto {
  id: string;
  type: string;
  documentRef: string;
  notice: string;

  constructor(id: string, type: string, documentRef: string, notice: string) {
    this.id = id;
    this.type = type;
    this.documentRef = documentRef;
    this.notice = notice;
  }
}
