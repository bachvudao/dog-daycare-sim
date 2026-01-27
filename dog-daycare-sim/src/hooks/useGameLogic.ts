import { useState, useCallback, useEffect } from 'react';
import type { Dog } from '../types/game';
import { useInterval } from './useInterval';
import { BREEDS } from '../types/breeds';
import { loadGame, saveGame, clearGame } from '../utils/persistence';
import { getRandomTrait, TRAITS } from '../types/traits';
import type { Worker as DaycareWorker } from '../types/worker';
import { EVENT_DEFINITIONS, type GameEvent, type EventType } from '../types/events';

const INITIAL_DOG: Dog = {
    id: 'dog-1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    trait: 'NONE',
    hunger: 80,
    happiness: 80,
    energy: 80,
    state: 'IDLE',
    color: '#eec27f',
    timeRemaining: 10,
    maxTime: 10,
};

export interface GameUpgrades {
    premiumFood: boolean;
    fancyToy: boolean;
    comfyBed: boolean;
}

const DOG_NAMES = ['Biscuit', 'Coco', 'Buddy', 'Daisy', 'Teddy', 'Nala', 'Archie', 'Milo', 'Luna', 'Cooper', 'Bailey', 'Charlie', 'Max', 'Sadie', 'Bear'];

export const getRandomName = () => DOG_NAMES[Math.floor(Math.random() * DOG_NAMES.length)];

export const useGameLogic = () => {
    // Lazy State Initialization from Storage
    const [dogs, setDogs] = useState<Dog[]>(() => {
        const saved = loadGame();
        return saved ? saved.dogs : [{ ...INITIAL_DOG, name: getRandomName() }];
    });

    const [money, setMoney] = useState(() => {
        const saved = loadGame();
        return saved ? saved.money : 100;
    });

    const [isPlaying, setIsPlaying] = useState(true);
    const [upgrades, setUpgrades] = useState<GameUpgrades>(() => {
        const saved = loadGame();
        return saved ? saved.upgrades : {
            premiumFood: false,
            fancyToy: false,
            comfyBed: false
        };
    });

    const [maxDogs, setMaxDogs] = useState(() => {
        const saved = loadGame();
        return saved ? saved.maxDogs : 1;
    });

    // Workers State
    const [workers, setWorkers] = useState<DaycareWorker[]>(() => {
        const saved = loadGame();
        return saved ? (saved.workers || []) : [];
    });

    // Meta State
    const [hasStarted, setHasStarted] = useState(() => {
        const saved = loadGame();
        return saved ? !!saved.hasStarted : false;
    });
    const [daycareName, setDaycareName] = useState(() => {
        const saved = loadGame();
        return saved ? (saved.daycareName || '') : '';
    });

    const [activeEvent, setActiveEvent] = useState<GameEvent | null>(() => {
        const saved = loadGame();
        return saved ? (saved.activeEvent || null) : null;
    });

    const [spawnTimer, setSpawnTimer] = useState<number | null>(null);



    // Auto-Save Effect
    useEffect(() => {
        // workers are serializable
        saveGame({ dogs, money, upgrades, maxDogs, workers, hasStarted, daycareName });
    }, [dogs, money, upgrades, maxDogs, workers, hasStarted, daycareName]);

    const startGame = (name: string) => {
        setDaycareName(name);
        setHasStarted(true);
    };

    const resetGame = useCallback(() => {
        clearGame();
        // Force reload to ensure clean state
        window.location.reload();
    }, []);

    // Helper: Generate a new random dog
    const generateDog = useCallback((): Dog => {
        const breed = BREEDS[Math.floor(Math.random() * BREEDS.length)];
        return {
            id: `dog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: getRandomName(),
            breed: breed,
            trait: getRandomTrait(),
            hunger: 50 + Math.floor(Math.random() * 40),
            happiness: 50 + Math.floor(Math.random() * 40),
            energy: 50 + Math.floor(Math.random() * 40),
            state: 'IDLE',
            color: '#fff',
            timeRemaining: 15 + Math.floor(Math.random() * 15),
            maxTime: 30,
        };
    }, []);

    const buyUpgrade = (key: keyof GameUpgrades, cost: number) => {
        if (money >= cost && !upgrades[key]) {
            setMoney(m => m - cost);
            setUpgrades(u => ({ ...u, [key]: true }));
            return true;
        }
        return false;
    };

    const buySlot = () => {
        const cost = 500 * maxDogs;
        if (money >= cost) {
            setMoney(m => m - cost);
            setMaxDogs(curr => curr + 1);
            return true;
        }
        return false;
    };

    const hireWorker = (candidate: DaycareWorker) => {
        if (money >= candidate.cost) {
            setMoney(m => m - candidate.cost);
            setWorkers(prev => [...prev, candidate]);
            return true;
        }
        return false;
    };

    const feedCost = upgrades.premiumFood ? 5 : 1;

    const tick = useCallback(() => {
        setDogs((currentDogs) => {
            let nextDogs = [...currentDogs];
            let moneyChange = 0;

            const evt = activeEvent;
            const isHeatwave = evt?.type === 'HEATWAVE';
            const isRain = evt?.type === 'RAIN';
            const isAdoption = evt?.type === 'ADOPTION_DRIVE';

            const updatedDogs = nextDogs.map((dog) => {
                if (dog.state === 'RETRIEVED') {
                    return { ...dog, timeRemaining: dog.timeRemaining - 0.1 };
                }

                const traitConfig = TRAITS[dog.trait]?.modifiers || {};

                let hungerDecay = 0.2 * (traitConfig.hungerDecay || 1);
                let happinessDecay = 0.1 * (traitConfig.happinessDecay || 1);
                let energyDecay = 0.05 * (traitConfig.energyDecay || 1);

                // Event Modifiers
                if (isHeatwave) energyDecay *= 2.0;
                if (isRain) happinessDecay *= 1.5;

                let newHunger = dog.hunger - hungerDecay;
                let newHappiness = dog.happiness - happinessDecay;
                let newEnergy = dog.energy - energyDecay;

                // State Effects
                if (dog.state === 'EATING') {
                    const boost = upgrades.premiumFood ? 4 : 2;
                    newHunger += boost;
                    if (newHunger >= 100) return { ...dog, hunger: 100, state: 'IDLE' as const };
                }
                if (dog.state === 'SLEEPING') {
                    const boost = upgrades.comfyBed ? 2 : 1;
                    newEnergy += boost;
                    if (newEnergy >= 100) return { ...dog, energy: 100, state: 'IDLE' as const };
                }
                if (dog.state === 'PLAYING') {
                    const boost = upgrades.fancyToy ? 4 : 2;
                    newHappiness += boost;
                    newEnergy -= 0.5;
                    if (newHappiness >= 100 || newEnergy <= 10) return { ...dog, happiness: Math.min(100, newHappiness), state: 'IDLE' as const };
                }

                const newTimeRemaining = dog.timeRemaining - 0.1;

                // Switch to RETRIEVED when time is up
                if (newTimeRemaining <= 0) {
                    // Calculate Payout NOW
                    const score = Math.round((dog.hunger + dog.happiness + dog.energy) / 3);
                    const isSuccess = dog.hunger > 50 && dog.happiness > 50 && dog.energy > 50;
                    let payout = 0;

                    if (isSuccess) {
                        payout = Math.floor(score * 1.5);
                        const traitConfig = TRAITS[dog.trait]?.modifiers || {};
                        if (traitConfig.payout) payout = Math.floor(payout * traitConfig.payout);

                        // Event Bonus
                        if (isAdoption) payout *= 2;
                    }
                    // Force clear workerId on retrieval
                    return { ...dog, timeRemaining: newTimeRemaining, state: 'RETRIEVED' as const, payout, workerId: undefined };
                }

                return {
                    ...dog,
                    hunger: Math.max(0, Math.min(100, newHunger)),
                    happiness: Math.max(0, Math.min(100, newHappiness)),
                    energy: Math.max(0, Math.min(100, newEnergy)),
                    timeRemaining: newTimeRemaining
                };
            });

            // Handle Departures
            const stayDogs: Dog[] = [];
            updatedDogs.forEach(dog => {
                if (dog.state === 'RETRIEVED' && dog.timeRemaining <= -2.0) {
                    if (dog.payout && dog.payout > 0) {
                        moneyChange += dog.payout;
                    }
                } else {
                    stayDogs.push(dog);
                }
            });

            // WORKER LOGIC
            const finalDogs = [...stayDogs];

            workers.forEach(worker => {
                let myDogIndex = finalDogs.findIndex(d => d.workerId === worker.id);

                // If I am working, check if done
                if (myDogIndex !== -1) {
                    let d = finalDogs[myDogIndex];
                    if (d.state === 'IDLE') {
                        // Check if satisfied
                        if (d.hunger > 90 && d.happiness > 90 && d.energy > 90) {
                            // Done, release
                            finalDogs[myDogIndex] = { ...d, workerId: undefined };
                            myDogIndex = -1;
                        } else {
                            // Needs more work?
                            let action: 'FEED' | 'PLAY' | 'SLEEP' | null = null;
                            if (d.hunger < 80) action = 'FEED';
                            else if (d.energy < 80) action = 'SLEEP';
                            else if (d.happiness < 80) action = 'PLAY';

                            if (action) {
                                if (action === 'FEED') {
                                    if (money + moneyChange >= feedCost) {
                                        moneyChange -= feedCost;
                                        finalDogs[myDogIndex] = { ...d, state: 'EATING' }; // workerId stays
                                    }
                                } else if (action === 'PLAY') {
                                    finalDogs[myDogIndex] = { ...d, state: 'PLAYING' };
                                } else if (action === 'SLEEP') {
                                    finalDogs[myDogIndex] = { ...d, state: 'SLEEPING' };
                                }
                            }
                        }
                    }
                }

                // If I need work
                if (myDogIndex === -1) {
                    let bestTargetIndex = -1;
                    let minStat = 100;

                    finalDogs.forEach((d, idx) => {
                        if (d.state === 'IDLE' && !d.workerId) {
                            const lowest = Math.min(d.hunger, d.happiness, d.energy);
                            if (lowest < 80 && lowest < minStat) {
                                minStat = lowest;
                                bestTargetIndex = idx;
                            }
                        }
                    });

                    if (bestTargetIndex !== -1) {
                        // Assign
                        const d = finalDogs[bestTargetIndex];
                        let action: 'FEED' | 'PLAY' | 'SLEEP' | null = null;
                        if (d.hunger < 80) action = 'FEED';
                        else if (d.energy < 80) action = 'SLEEP';
                        else if (d.happiness < 80) action = 'PLAY';

                        if (action) {
                            if (action === 'FEED') {
                                if (money + moneyChange >= feedCost) {
                                    moneyChange -= feedCost;
                                    finalDogs[bestTargetIndex] = { ...d, state: 'EATING', workerId: worker.id };
                                }
                            } else if (action === 'PLAY') {
                                finalDogs[bestTargetIndex] = { ...d, state: 'PLAYING', workerId: worker.id };
                            } else if (action === 'SLEEP') {
                                finalDogs[bestTargetIndex] = { ...d, state: 'SLEEPING', workerId: worker.id };
                            }
                        }
                    }
                }
            });

            if (moneyChange !== 0) {
                setTimeout(() => setMoney(m => m + moneyChange), 0);
            }

            return finalDogs;
        });

        // Event Loop Logic
        setActiveEvent(prev => {
            if (prev) {
                const left = prev.duration - 0.1;
                if (left <= 0) return null;
                return { ...prev, duration: left };
            } else {
                // 1/500 chance per tick ~ every 50s
                if (Math.random() < 0.002) {
                    const keys = Object.keys(EVENT_DEFINITIONS) as EventType[];
                    const selectedType = keys[Math.floor(Math.random() * keys.length)];
                    const def = EVENT_DEFINITIONS[selectedType];
                    return {
                        ...def,
                        id: Date.now().toString(),
                        duration: 20
                    };
                }
                return null;
            }
        });

    }, [upgrades, workers, money, feedCost, activeEvent]);

    // Spawning Effect: Spawn if we have room (dogs.length < maxDogs)
    useEffect(() => {
        // We only care about active dogs logic, but let's just stick to raw length for simplicity
        if (dogs.length < maxDogs && !spawnTimer) {
            const timer = setTimeout(() => {
                setDogs(prev => {
                    if (prev.length < maxDogs) return [...prev, generateDog()];
                    return prev;
                });
                setSpawnTimer(null);
            }, 2000);
            setSpawnTimer(timer);
        }
    }, [dogs.length, maxDogs, spawnTimer, generateDog]);

    useInterval(tick, isPlaying ? 100 : null);

    const interact = (dogId: string, action: 'FEED' | 'PLAY' | 'SLEEP') => {
        // Cost check for feeding
        if (action === 'FEED') {
            if (money < feedCost) return; // Cannot afford
            setMoney(m => m - feedCost);
        }

        setDogs((current) =>
            current.map((dog) => {
                if (dog.id !== dogId) return dog;
                if (action === 'FEED') return { ...dog, state: 'EATING' };
                if (action === 'PLAY') return { ...dog, state: 'PLAYING' };
                if (action === 'SLEEP') return { ...dog, state: 'SLEEPING' };
                return dog;
            })
        );
    };

    return { dogs, money, interact, isPlaying, setIsPlaying, upgrades, buyUpgrade, maxDogs, buySlot, feedCost, workers, hireWorker, hasStarted, daycareName, startGame, resetGame, activeEvent };
};
