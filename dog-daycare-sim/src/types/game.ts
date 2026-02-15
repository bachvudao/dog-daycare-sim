import type { Breed } from './breeds';
import type { TraitType } from './traits';

export type DogState = 'IDLE' | 'SLEEPING' | 'EATING' | 'PLAYING' | 'RETRIEVED';

export interface Dog {
  id: string;
  name: string;
  breed: Breed;
  trait: TraitType; // New property
  hunger: number; // 0-100 (100 is full)
  happiness: number; // 0-100 (100 is happy)
  energy: number; // 0-100 (100 is energetic)
  state: DogState;
  // Visuals
  color: string;
  // Progression
  timeRemaining: number; // in seconds
  maxTime: number; // total stay duration
  payout?: number; // Calculated payout amount
  workerId?: string; // ID of worker currently attending
  isVIP?: boolean;
}

export interface GameConfig {
  tickRate: number; // ms per tick
  hungerDecay: number;
  happinessDecay: number;
  energyDecay: number;
}
