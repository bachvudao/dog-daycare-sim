import React, { useState, useEffect } from 'react';
import type { GameUpgrades } from '../hooks/useGameLogic';
import type { Worker } from '../types/worker';
import { generateWorker } from '../types/worker';

interface ShopProps {
    money: number;
    upgrades: GameUpgrades;
    buyUpgrade: (key: keyof GameUpgrades, cost: number) => boolean;
    onClose: () => void;
    hireWorker: (candidate: Worker) => boolean;
    workers: Worker[];
}

export const Shop: React.FC<ShopProps> = ({ money, upgrades, buyUpgrade, onClose, hireWorker, workers = [] }) => {
    const [candidate, setCandidate] = useState<Worker | null>(null);

    useEffect(() => {
        if (!candidate) {
            setCandidate(generateWorker(1000 * (workers.length + 1))); // Scaled cost
        }
    }, [candidate, workers.length]);

    const ITEMS = [
        { id: 'premiumFood', name: 'Premium Food', desc: 'Feeding is 2x effective', cost: 50, icon: '🥩' },
        { id: 'fancyToy', name: 'Fancy Toy', desc: 'Playing is 2x effective', cost: 50, icon: '🧸' },
        { id: 'comfyBed', name: 'Comfy Bed', desc: 'Resting is 2x effective', cost: 100, icon: '🛏️' },
    ] as const;

    const handleHire = () => {
        if (candidate && hireWorker(candidate)) {
            setCandidate(null); // Will regenerate
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '24px',
                width: '600px',
                maxWidth: '90%',
                maxHeight: '90vh', // Prevent overflow
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '32px' }}>Department Store</h2>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'
                    }}>✕</button>
                </div>

                <div style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>
                    Balance: ${money}
                </div>

                {/* Staff Section */}
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '16px' }}>Staff</h3>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>

                    {/* Current Staff List */}
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>Current Team ({workers.length})</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '100px', overflowY: 'auto' }}>
                            {workers.length === 0 && <p style={{ fontSize: '13px', color: '#999' }}>No staff hired yet.</p>}
                            {workers.map(w => (
                                <div key={w.id} title={w.name} style={{
                                    fontSize: '24px', background: '#eee', borderRadius: '50%', padding: '4px', cursor: 'help'
                                }}>
                                    {w.avatar}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hiring Card */}
                    {candidate && (
                        <div style={{
                            flex: 1,
                            padding: '16px',
                            border: '2px solid #2e7d32',
                            borderRadius: '12px',
                            backgroundColor: '#e8f5e9',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '48px' }}>{candidate.avatar}</div>
                            <div>
                                <h4 style={{ margin: 0 }}>{candidate.name}</h4>
                                <div style={{ fontSize: '12px', color: '#555' }}>Daycare Specialist</div>
                            </div>
                            <button
                                onClick={handleHire}
                                disabled={money < candidate.cost}
                                style={{
                                    marginTop: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: money >= candidate.cost ? '#2e7d32' : '#ccc',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: money >= candidate.cost ? 'pointer' : 'not-allowed',
                                    width: '100%'
                                }}
                            >
                                Hire (${candidate.cost})
                            </button>
                        </div>
                    )}
                </div>

                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '16px' }}>Upgrades</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {ITEMS.map(item => {
                        const isOwned = upgrades[item.id as keyof GameUpgrades];
                        const canAfford = money >= item.cost;

                        return (
                            <div key={item.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '16px',
                                backgroundColor: isOwned ? '#e8f5e9' : '#f5f5f5',
                                borderRadius: '16px',
                                border: isOwned ? '2px solid #66bb6a' : '2px solid transparent'
                            }}>
                                <div style={{ fontSize: '32px', marginRight: '16px' }}>{item.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{item.name}</h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{item.desc}</p>
                                </div>
                                {isOwned ? (
                                    <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>Owned</div>
                                ) : (
                                    <button
                                        onClick={() => buyUpgrade(item.id as keyof GameUpgrades, item.cost)}
                                        disabled={!canAfford}
                                        style={{
                                            backgroundColor: canAfford ? '#29b6f6' : '#ccc',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            cursor: canAfford ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        ${item.cost}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
