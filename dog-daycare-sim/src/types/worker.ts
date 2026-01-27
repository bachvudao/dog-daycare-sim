export interface Worker {
    id: string;
    name: string;
    avatar: string;
    cost: number;
    assignedDogId?: string; // Runtime status
    efficiency: number; // For future depth, maybe default 1.0
}

export const WORKER_NAMES = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George', 'Hannah',
    'Ian', 'Julia', 'Kevin', 'Laura', 'Mike', 'Nina', 'Oscar', 'Paula',
    'Quinn', 'Rachel', 'Sam', 'Tina', 'Umar', 'Vicky', 'Will', 'Xena', 'Yara', 'Zack'
];

export const WORKER_AVATARS = [
    '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍⚕️', '👨‍⚕️', '👩‍🔧', '👨‍🔧',
    '👩‍🔬', '👨‍🔬', '👩‍🎤', '👨‍🎤', '👩‍🎨', '👨‍🎨', '👮‍♀️', '👮‍♂️',
    '🕵️‍♀️', '🕵️‍♂️', '🦸‍♀️', '🦸‍♂️', '🧙‍♀️', '🧙‍♂️', '🧛‍♀️', '🧛‍♂️'
];

export const generateWorker = (baseCost: number): Worker => {
    const name = WORKER_NAMES[Math.floor(Math.random() * WORKER_NAMES.length)];
    const avatar = WORKER_AVATARS[Math.floor(Math.random() * WORKER_AVATARS.length)];

    // Cost varies slightly for flavor using baseCost
    const cost = baseCost + Math.floor(Math.random() * 200) - 100;

    return {
        id: `worker-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name,
        avatar,
        cost: Math.max(100, cost), // Minimum 100
        efficiency: 1.0
    };
};
