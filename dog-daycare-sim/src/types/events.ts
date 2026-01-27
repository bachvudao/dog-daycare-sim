export type EventType = 'HEATWAVE' | 'RAIN' | 'ADOPTION_DRIVE';

export interface GameEvent {
    id: string; // unique instance id
    type: EventType;
    name: string;
    description: string;
    duration: number; // remaining seconds
    color: string;
    icon: string;
}

export const EVENT_DEFINITIONS: Record<EventType, Omit<GameEvent, 'id' | 'duration'>> = {
    HEATWAVE: {
        type: 'HEATWAVE',
        name: 'Heatwave',
        description: 'Blazing sun! Energy drains 2x faster.',
        color: '#ff9800',
        icon: '☀️'
    },
    RAIN: {
        type: 'RAIN',
        name: 'Rainy Day',
        description: 'Gloomy weather... Happiness drops faster.',
        color: '#607d8b',
        icon: '🌧️'
    },
    ADOPTION_DRIVE: {
        type: 'ADOPTION_DRIVE',
        name: 'Adoption Drive',
        description: 'Adoption fees are doubled!',
        color: '#e91e63',
        icon: '🎉'
    }
};
