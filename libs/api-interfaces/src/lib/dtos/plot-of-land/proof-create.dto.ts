enum ProofType {
  PROOF_OF_FREEDOM = 'PROOF_OF_FREEDOM',
  PROOF_OF_OWNERSHIP = 'PROOF_OF_OWNERSHIP',
}

class ProofCreateDto {
  type: ProofType;
  documentRef: string;
  notice: string;

  constructor(type: ProofType, documentRef: string, notice: string) {
    this.type = type;
    this.documentRef = documentRef;
    this.notice = notice;
  }
}
export { ProofType, ProofCreateDto };
