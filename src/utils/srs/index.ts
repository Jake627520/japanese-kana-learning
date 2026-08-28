import { SRSMode } from './types';

export * from './types';
export * from './migration';
export * from './engine';

/**
 * Feature Flag for SRS Engine Mode.
 * Defaults to 'legacy' in Phase 1 to guarantee 100% backward compatibility.
 */
export const SRS_MODE: SRSMode = 'legacy';
