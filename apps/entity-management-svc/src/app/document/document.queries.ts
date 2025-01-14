/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

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
