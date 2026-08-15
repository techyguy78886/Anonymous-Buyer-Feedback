import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export class Contract {
  witnesses;
  circuits;

  constructor(witnesses) {
    this.witnesses = witnesses;
    this.circuits = {
      submitFeedback: (context, expectedMerchantId) => {
        return {
          result: new Uint8Array(32),
          context: context
        };
      },
      verifyFeedback: (context, claimedCommitment) => {
        return {
          result: true,
          context: context
        };
      },
      flagFeedback: (context, commitmentToFlag) => {
        return {
          result: commitmentToFlag,
          context: context
        };
      },
      setMerchantCommitment: (context, newMinimumRating) => {
        return {
          result: new Uint8Array(32),
          context: context
        };
      },
      resetMerchantProduct: (context, newMerchantId, newMinimumRating) => {
        return {
          result: newMerchantId,
          context: context
        };
      },
      incrementSession: (context) => {
        return {
          result: [],
          context: context
        };
      }
    };
  }

  initialState(context) {
    return {
      currentContractState: 0,
      currentZkState: context.currentZkState,
      transactionContext: context.transactionContext
    };
  }
}

export function ledger(state) {
  return {
    feedbackCount: 0n,
    flaggedCount: 0n,
    activeSession: 1n,
    merchantId: new Uint8Array(32),
    merchantCommitment: new Uint8Array(32),
    lastFeedbackCommitment: new Uint8Array(32),
    lastFlaggedCommitment: new Uint8Array(32),
    minimumRatingScore: 1
  };
}

export const pureCircuits = {};
export const contractReferenceLocations = {};
