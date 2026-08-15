import * as __compactRuntime from "@midnight-ntwrk/compact-runtime";

export enum StateValue {
  vacant = 0,
  occupied = 1
}

export type Witnesses<T> = {
  buyerSecretKey(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  orderInvoiceHash(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  ratingScore(context: __compactRuntime.WitnessContext<Ledger, T>): [T, number];
  feedbackProofNonce(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  merchantSigningKey(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  submitFeedback(context: __compactRuntime.CircuitContext<T>, expectedMerchantId: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  verifyFeedback(context: __compactRuntime.CircuitContext<T>, claimedCommitment: Uint8Array): __compactRuntime.CircuitResults<T, boolean>;
  flagFeedback(context: __compactRuntime.CircuitContext<T>, commitmentToFlag: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  setMerchantCommitment(context: __compactRuntime.CircuitContext<T>, newMinimumRating: number): __compactRuntime.CircuitResults<T, Uint8Array>;
  resetMerchantProduct(context: __compactRuntime.CircuitContext<T>, newMerchantId: Uint8Array, newMinimumRating: number): __compactRuntime.CircuitResults<T, Uint8Array>;
  incrementSession(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
}

export type PureCircuits = {}

export type Circuits<T> = {
  submitFeedback(context: __compactRuntime.CircuitContext<T>, expectedMerchantId: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  verifyFeedback(context: __compactRuntime.CircuitContext<T>, claimedCommitment: Uint8Array): __compactRuntime.CircuitResults<T, boolean>;
  flagFeedback(context: __compactRuntime.CircuitContext<T>, commitmentToFlag: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  setMerchantCommitment(context: __compactRuntime.CircuitContext<T>, newMinimumRating: number): __compactRuntime.CircuitResults<T, Uint8Array>;
  resetMerchantProduct(context: __compactRuntime.CircuitContext<T>, newMerchantId: Uint8Array, newMinimumRating: number): __compactRuntime.CircuitResults<T, Uint8Array>;
  incrementSession(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
}

export type Ledger = {
  readonly feedbackCount: bigint;
  readonly flaggedCount: bigint;
  readonly activeSession: bigint;
  readonly merchantId: Uint8Array;
  readonly merchantCommitment: Uint8Array;
  readonly lastFeedbackCommitment: Uint8Array;
  readonly lastFlaggedCommitment: Uint8Array;
  readonly minimumRatingScore: number;
}

export type ContractReferenceLocations = {}

export declare const contractReferenceLocations: ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> implements __compactRuntime.Contract<T, StateValue> {
  witnesses: W;
  circuits: Circuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
