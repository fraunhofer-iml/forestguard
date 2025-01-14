/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
