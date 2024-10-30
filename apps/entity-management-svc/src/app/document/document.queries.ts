export function createProcessDocQuery(description: string, documentRef: string, processStepId: string) {
  return {
    data: {
      description: description,
      documentRef: documentRef,
      processStep: {
        connect: {
          id: processStepId,
        },
      },
    },
  };
}

export function createFarmerDocQuery(description: string, documentRef: string, farmerId: string) {
  return {
    data: {
      description: description,
      documentRef: documentRef,
      user: {
        connect: {
          id: farmerId,
        },
      },
    },
  };
}
