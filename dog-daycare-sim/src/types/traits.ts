export type TraitType = 'NONE' | 'GLUTTON' | 'HYPER' | 'LAZY' | 'PLAYFUL' | 'LOVABLE';

export interface TraitConfig {
    name: string;
    icon: string;
    description: string;
    modifiers: {
        hungerDecay?: number; // Multiplier
        happinessDecay?: number;
        energyDecay?: number;
        payout?: number;
    }
}

export const TRAITS: Record<TraitType, TraitConfig> = {
    NONE: {
        name: 'Standard',
        icon: '',
        description: 'Just a normal, good dog.',
        modifiers: {}
    },
    GLUTTON: {
        name: 'Glutton',
        icon: '🍔',
        description: 'Gets hungry faster.',
        modifiers: { hungerDecay: 1.5 }
    },
    HYPER: {
        name: 'Hyper',
        icon: '⚡',
        description: 'Burns energy quickly.',
        modifiers: { energyDecay: 1.5 }
    },
    LAZY: {
        name: 'Lazy',
        icon: '💤',
        description: 'Slow energy decay.',
        modifiers: { energyDecay: 0.5 }
    },
    PLAYFUL: {
        name: 'Playful',
        icon: '🎾',
        description: 'Needs constant attention.',
        modifiers: { happinessDecay: 1.5 }
    },
    LOVABLE: {
        name: 'Lovable',
        icon: '💖',
        description: 'Owners tip extra!',
        modifiers: { payout: 1.5 }
    }
};

export const getRandomTrait = (): TraitType => {
    const keys = Object.keys(TRAITS) as TraitType[];
    // Weighted random? Or just uniform? 
    // Let's exclude NONE for fun, or keep it as specific "Normal".
    // 20% chance for NONE, 80% for special trait.
    if (Math.random() < 0.2) return 'NONE';

    // Filter out NONE from random pick
    const specialTraits = keys.filter(k => k !== 'NONE');
    return specialTraits[Math.floor(Math.random() * specialTraits.length)];
};
