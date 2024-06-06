export class ProofDto {
  documentId: string;
  type: string;
  documentRef: string;
  notice: string;

  constructor(documentId: string, type: string, documentRef: string, notice: string) {
    this.documentId = documentId;
    this.type = type;
    this.documentRef = documentRef;
    this.notice = notice;
  }
}
