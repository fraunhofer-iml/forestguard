import { ProofType } from '@forest-guard/api-interfaces';
import { Proof } from '@prisma/client';

const PROOF_PRISMA_MOCK: Proof = {
  documentId: '2',
  type: ProofType.PROOF_OF_FREEDOM,
  documentRef: '1-1-1-1-1.pdf',
  notice: 'This land is certified organic.',
  plotOfLandId: '1',
};

export { PROOF_PRISMA_MOCK };
