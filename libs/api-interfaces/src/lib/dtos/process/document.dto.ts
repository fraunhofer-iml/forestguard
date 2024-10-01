export class DocumentDto {
  description: string
  documentRef: string

  constructor(description: string, documentRef: string) {
    this.description = description;
    this.documentRef = documentRef;
  }
}
