import type { Dog } from '../types/game';
import type { GameUpgrades } from '../hooks/useGameLogic';
import type { GameEvent } from '../types/events';
import type { Worker as DaycareWorker } from '../types/worker';

const SAVE_KEY = 'dogDaycare_saveData_v1';

// ...
export interface SaveData {
    money: number;
    maxDogs: number;
    workers: DaycareWorker[];
    upgrades: GameUpgrades;
    dogs: Dog[];
    lastSaveTime: number;
    daycareName?: string;
    hasStarted?: boolean;
    activeEvent?: GameEvent | null;
}

export const loadGame = (): SaveData | null => {
    try {
        const data = localStorage.getItem(SAVE_KEY);
        if (!data) return null;
        return JSON.parse(data) as SaveData;
    } catch (e) {
        console.error('Failed to load save data:', e);
        return null;
    }
};

export const clearGame = () => {
    localStorage.removeItem(SAVE_KEY);
};

export const saveGame = (data: Omit<SaveData, 'lastSaveTime'>) => {
    try {
        const fullData: SaveData = {
            ...data,
            lastSaveTime: Date.now()
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(fullData));
    } catch (e) {
        console.error('Failed to save game:', e);
    }
};

export const clearSave = () => {
    localStorage.removeItem(SAVE_KEY);
};
