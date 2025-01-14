/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

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
