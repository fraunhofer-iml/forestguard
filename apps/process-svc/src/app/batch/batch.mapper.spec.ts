import { mapBatchPrismaToBatchDto } from './batch.mapper';
import { mockedPrismaBatchWithRelations1, mockedPrismaBatchWithRelations2 } from './mocked-data/batch.mock';

describe('Batch Mapper', () => {
  it('should map BatchWithRelations to BatchDto', () => {
    const expectedBatchDto = {
      ...mockedPrismaBatchWithRelations1,
      processStep: {
        ...mockedPrismaBatchWithRelations1.processStep,
        recordedBy: mockedPrismaBatchWithRelations1.processStep.recordedBy.user,
        executedBy: mockedPrismaBatchWithRelations1.processStep.executedBy.user,
      },
      recipient: {
        ...mockedPrismaBatchWithRelations1.recipient.user,
      },
    };

    const expectedBatchDto2 = {
      ...mockedPrismaBatchWithRelations2,
      processStep: {
        ...mockedPrismaBatchWithRelations2.processStep,
        recordedBy: mockedPrismaBatchWithRelations2.processStep.recordedBy.company,
        executedBy: mockedPrismaBatchWithRelations2.processStep.executedBy.company,
      },
      recipient: {
        ...mockedPrismaBatchWithRelations2.recipient.company,
      },
    };

    const result = mapBatchPrismaToBatchDto(mockedPrismaBatchWithRelations1);
    expect(result).toEqual(expectedBatchDto);

    const result2 = mapBatchPrismaToBatchDto(mockedPrismaBatchWithRelations2);
    expect(result2).toEqual(expectedBatchDto2);
  });
});
