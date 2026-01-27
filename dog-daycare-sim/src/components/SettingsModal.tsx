import React from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isPlaying: boolean;
    onTogglePause: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isPlaying, onTogglePause }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '32px' }}>⚙️ Settings</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        ❌
                    </button>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '24px', color: '#555', marginBottom: '16px' }}>Game Control</h3>
                    <button
                        onClick={onTogglePause}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: isPlaying ? '#ff9800' : '#4caf50',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: isPlaying ? '0 4px 0 #b36b00' : '0 4px 0 #2e7d32'
                        }}
                    >
                        {isPlaying ? '⏸️ Pause Game' : '▶️ Resume Game'}
                    </button>
                </div>

                <div>
                    <h3 style={{ fontSize: '24px', color: '#555', marginBottom: '16px' }}>How to Play 📖</h3>
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        lineHeight: '1.5',
                        color: '#444',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        <p><strong>Goal:</strong> Run the best dog daycare in town! 🏆</p>
                        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                            <li><strong>Care:</strong> Tap dogs to Feed 🍖, Play 🎾, or Sleep 💤 based on their needs.</li>
                            <li><strong>Workers:</strong> Hire staff to automate tasks. Each worker has a specific style! 👩‍⚕️</li>
                            <li><strong>Events:</strong> Watch out for Heatwaves ☀️ and Rain 🌧️!</li>
                            <li><strong>Money:</strong> Earn cash when satisfied dogs are picked up. Use it to upgrade items and expand slots! 💰</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
