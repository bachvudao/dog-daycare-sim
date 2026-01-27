import React, { useEffect, useRef } from 'react';
import type { Dog } from '../types/game';
import { BREEDS } from '../types/breeds';
import type { Breed } from '../types/breeds';
import { TRAITS } from '../types/traits';
import type { Worker } from '../types/worker';

// Helper to calculate sprite locally if needed, or stick to imported
const calculateSprite = (breed: Breed) => {
    const breedIndex = BREEDS.indexOf(breed);
    const safeIndex = breedIndex === -1 ? 0 : breedIndex;
    const cols = 5;
    const col = safeIndex % cols;
    const row = Math.floor(safeIndex / cols);
    return { col, row };
};
interface DogCardProps {
    dog: Dog;
    onInteract: (action: 'FEED' | 'PLAY' | 'SLEEP', e?: React.MouseEvent) => void;
    feedCost?: number;
    onPayout?: (amount: number, rect: DOMRect) => void;
    assignedWorker?: Worker | undefined;
}

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
            <span>{label}</span>
            <span>{Math.round(value)}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
            <div
                style={{
                    width: `${value}%`,
                    height: '100%',
                    backgroundColor: color,
                    transition: 'width 0.2s linear',
                }}
            />
        </div>
    </div>
);

export const DogCard: React.FC<DogCardProps> = ({ dog, onInteract, feedCost = 0, onPayout }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const payoutTriggeredRef = useRef(false);

    useEffect(() => {
        if (dog.state === 'RETRIEVED' && dog.payout && dog.payout > 0 && !payoutTriggeredRef.current) {
            if (cardRef.current && onPayout) {
                const rect = cardRef.current.getBoundingClientRect();
                onPayout(dog.payout, rect);
                payoutTriggeredRef.current = true;
            }
        }
    }, [dog.state, dog.payout, onPayout]);

    return (
        <div
            ref={cardRef}
            className={dog.state === 'RETRIEVED' ? 'leaving' : ''}
            style={{
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '260px',
                height: '380px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end', // Push content to bottom
                overflow: 'hidden',
                color: 'white'
            }}
        >
            {/* Background Sprite Image */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/dogs_realistic.png)',
                backgroundSize: '500% auto', // 5 columns
                backgroundPosition: `${(calculateSprite(dog.breed).col) * 25}% ${(calculateSprite(dog.breed).row) * 100}%`,
                zIndex: 0,
            }} />

            {/* Gradient Mesh / Overlay for Text Protection */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '70%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
                zIndex: 1,
                pointerEvents: 'none'
            }} />

            {/* State Indicators (Floating Top Right) */}
            {dog.state !== 'IDLE' && dog.state !== 'RETRIEVED' && (
                <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,0.9)',
                    padding: '8px',
                    borderRadius: '50%',
                    fontSize: '24px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {dog.workerId && <span style={{ fontSize: '16px' }}>👷‍♂️</span>}
                    {dog.state === 'EATING' && '🍖'}
                    {dog.state === 'PLAYING' && '🎾'}
                    {dog.state === 'SLEEPING' && '💤'}
                </div>
            )}

            {/* Timer Badge (Top Left) */}
            {dog.state !== 'RETRIEVED' && (
                <div style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: dog.timeRemaining < 10 ? '#ef5350' : 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 20
                }}>
                    ⏳ {Math.ceil(dog.timeRemaining)}s
                </div>
            )}

            {/* Content Content (Z-Index > 1) */}
            <div style={{ position: 'relative', zIndex: 10, padding: '16px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{dog.name}</h3>
                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', opacity: 0.9 }}>{dog.breed}</p>
                    </div>
                    {/* Trait Badge */}
                    {dog.trait !== 'NONE' && (
                        <div title={TRAITS[dog.trait].description} style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(4px)',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            cursor: 'help'
                        }}>
                            <span style={{ fontSize: '16px' }}>{TRAITS[dog.trait].icon}</span>
                            <span>{TRAITS[dog.trait].name}</span>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <StatBar label="Hunger" value={dog.hunger} color="#ffab91" />
                    <StatBar label="Happiness" value={dog.happiness} color="#81d4fa" />
                    <StatBar label="Energy" value={dog.energy} color="#a5d6a7" />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={(e) => onInteract('FEED', e)} disabled={dog.state !== 'IDLE'}
                        style={{ flex: 1, padding: '10px 0', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: '600' }}>
                        Feed (${feedCost})
                    </button>
                    <button onClick={(e) => onInteract('PLAY', e)} disabled={dog.state !== 'IDLE'}
                        style={{ flex: 1, padding: '10px 0', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: '600' }}>
                        Play
                    </button>
                    <button onClick={(e) => onInteract('SLEEP', e)} disabled={dog.state !== 'IDLE'}
                        style={{ flex: 1, padding: '10px 0', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: '600' }}>
                        Rest
                    </button>
                </div>
            </div>

            {/* Retrieved Overlay */}
            {dog.state === 'RETRIEVED' && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 30,
                    color: '#333'
                }}>
                    <h2 style={{ marginBottom: '12px' }}>Retrieved!</h2>
                    <div style={{ fontSize: '56px', marginBottom: '8px' }}>
                        {(dog.hunger > 50 && dog.happiness > 50 && dog.energy > 50) ? '👍' : '👎'}
                    </div>
                    <p style={{ color: '#666', fontWeight: '500' }}>
                        {(dog.hunger > 50 && dog.happiness > 50 && dog.energy > 50) ? 'Great Job!' : 'Needs Work...'}
                    </p>
                    {dog.payout && (
                        <div style={{
                            marginTop: '12px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#2e7d32',
                            animation: 'bounce 0.5s'
                        }}>
                            +${dog.payout}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
