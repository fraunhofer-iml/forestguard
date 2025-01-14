/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

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
