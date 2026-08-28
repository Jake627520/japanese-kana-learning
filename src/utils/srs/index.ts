import { SRSMode } from './types';

export * from './types';
export * from './migration';
export * from './engine';
export * from './scheduler';
export * from './reviewAdapter';

/**
 * Feature Flag for SRS Engine Mode.
 * Defaults to 'legacy' in Phase 1 & 2 to guarantee 100% backward compatibility.
 */
export const SRS_MODE: SRSMode = 'legacy';
