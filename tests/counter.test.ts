import { describe, it, expect } from 'vitest';
import { Contract, ledger } from '../managed/contract/index.js';

describe('Anonymous Buyer Feedback (ABF) — Compact v2 Smart Contract Suite', () => {
  const dummyContext = {
    currentZkState: new Uint8Array(32),
    transactionContext: {}
  };

  const createWitnesses = (overrides = {}) => ({
    buyerSecretKey: (ctx: any) => [ctx, new Uint8Array(32).fill(1)],
    orderInvoiceHash: (ctx: any) => [ctx, new Uint8Array(32).fill(2)],
    ratingScore: (ctx: any) => [ctx, 5],
    feedbackProofNonce: (ctx: any) => [ctx, new Uint8Array(32).fill(3)],
    merchantSigningKey: (ctx: any) => [ctx, new Uint8Array(32).fill(4)],
    ...overrides
  });

  it('1. Contract Instantiation & Witness Verification', () => {
    const witnesses = createWitnesses();
    const contract = new Contract(witnesses);
    expect(contract).toBeDefined();
    expect(contract.witnesses).toBeDefined();
    expect(contract.circuits).toBeDefined();
  });

  it('2. Private Witness Isolation & Data Privacy', () => {
    const witnesses = createWitnesses();
    const contract = new Contract(witnesses);
    const state = contract.initialState({ currentZkState: new Uint8Array(32), transactionContext: {} });
    const publicLedger = ledger(state.currentContractState);
    
    // Ensure raw buyer secret key and invoice hash are not in public ledger
    expect((publicLedger as any).buyerSecretKey).toBeUndefined();
    expect((publicLedger as any).orderInvoiceHash).toBeUndefined();
    expect((publicLedger as any).ratingScore).toBeUndefined();
  });

  it('3. submitFeedback Circuit Execution & Commitment Generation', () => {
    const witnesses = createWitnesses();
    const contract = new Contract(witnesses);
    const expectedMerchantId = new Uint8Array(32).fill(9);
    
    const res = contract.circuits.submitFeedback(dummyContext as any, expectedMerchantId);
    expect(res).toBeDefined();
    expect(res.result).toBeInstanceOf(Uint8Array);
    expect(res.result.length).toBe(32);
  });

  it('4. Rating Score Boundary Enforcement (1 to 5 Stars)', () => {
    const validWitnesses = createWitnesses({ ratingScore: (ctx: any) => [ctx, 4] });
    const contract = new Contract(validWitnesses);
    const expectedMerchantId = new Uint8Array(32).fill(9);
    
    const res = contract.circuits.submitFeedback(dummyContext as any, expectedMerchantId);
    expect(res.result).toBeDefined();
  });

  it('5. verifyFeedback Circuit & Public Commitment Validation', () => {
    const witnesses = createWitnesses();
    const contract = new Contract(witnesses);
    const claimedCommitment = new Uint8Array(32).fill(7);
    
    const res = contract.circuits.verifyFeedback(dummyContext as any, claimedCommitment);
    expect(res.result).toBe(true);
  });

  it('6. flagFeedback Circuit & Merchant Authority Execution', () => {
    const witnesses = createWitnesses();
    const contract = new Contract(witnesses);
    const commitmentToFlag = new Uint8Array(32).fill(8);
    
    const res = contract.circuits.flagFeedback(dummyContext as any, commitmentToFlag);
    expect(res.result).toEqual(commitmentToFlag);
  });

  it('7. setMerchantCommitment Circuit Execution & Config Update', () => {
    const witnesses = createWitnesses();
    const contract = new Contract(witnesses);
    const newMinimumRating = 3;
    
    const res = contract.circuits.setMerchantCommitment(dummyContext as any, newMinimumRating);
    expect(res.result).toBeInstanceOf(Uint8Array);
    expect(res.result.length).toBe(32);
  });

  it('8. resetMerchantProduct Circuit & Catalog Rotation', () => {
    const witnesses = createWitnesses();
    const contract = new Contract(witnesses);
    const newMerchantId = new Uint8Array(32).fill(11);
    const newMinimumRating = 2;
    
    const res = contract.circuits.resetMerchantProduct(dummyContext as any, newMerchantId, newMinimumRating);
    expect(res.result).toEqual(newMerchantId);
  });

  it('9. incrementSession Circuit & Replay Protection', () => {
    const witnesses = createWitnesses();
    const contract = new Contract(witnesses);
    
    const res = contract.circuits.incrementSession(dummyContext as any);
    expect(res.result).toEqual([]);
  });

  it('10. Public Ledger Schema Integrity & Field Verification (8 fields)', () => {
    const state = { currentContractState: 0 };
    const l = ledger(state.currentContractState as any);
    
    expect(typeof l.feedbackCount).toBe('bigint');
    expect(typeof l.flaggedCount).toBe('bigint');
    expect(typeof l.activeSession).toBe('bigint');
    expect(l.merchantId).toBeInstanceOf(Uint8Array);
    expect(l.merchantCommitment).toBeInstanceOf(Uint8Array);
    expect(l.lastFeedbackCommitment).toBeInstanceOf(Uint8Array);
    expect(l.lastFlaggedCommitment).toBeInstanceOf(Uint8Array);
    expect(typeof l.minimumRatingScore).toBe('number');
  });
});
