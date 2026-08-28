import { SRSMode } from './types';

export * from './types';
export * from './migration';
export * from './engine';
export * from './scheduler';
export * from './reviewAdapter';
export * from './shadowEvaluator';

/**
 * Feature Flag for SRS Engine Mode.
 * - 'legacy': Default production mode (100% legacy backward compatible).
 * - 'shadow': Observability & shadow evaluation (adaptive calculated, legacy controls due list).
 * - 'adaptive': Active adaptive scheduling (for Phase 4+).
 */
export const SRS_MODE: SRSMode = 'legacy';
