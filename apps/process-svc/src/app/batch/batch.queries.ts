export const readCoffeeBatchesByCompanyIdQuery = (companyId: string) => ({
  where: {
    recipientId: companyId,
  },
  include: {
    recipient: {
      include: {
        company: {
          include: {
            address: true,
          },
        },
        user: {
          include: {
            address: true,
          },
        },
      },
    },
    processStep: {
      include: {
        process: true,
        recordedBy: {
          include: {
            company: {
              include: {
                address: true,
              },
            },
            user: {
              include: {
                address: true,
              },
            },
          },
        },
        executedBy: {
          include: {
            company: {
              include: {
                address: true,
              },
            },
            user: {
              include: {
                address: true,
              },
            },
          },
        },
        farmedLand: true,
      },
    },
  },
});
