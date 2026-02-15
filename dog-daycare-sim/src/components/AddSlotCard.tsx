import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AddSlotCardProps {
    cost: number;
    canAfford: boolean;
    onBuy: () => void;
}

export const AddSlotCard: React.FC<AddSlotCardProps> = ({ cost, canAfford, onBuy }) => {
    const { t } = useLanguage();
    return (
        <div
            onClick={() => canAfford && onBuy()}
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                width: '260px',
                height: '380px',
                border: '4px dashed rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: canAfford ? 1 : 0.7
            }}
        >
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: canAfford ? '#4caf50' : '#bdbdbd',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                marginBottom: '16px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                +
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#555' }}>{t('add_slot.card_title')}</h3>
            <div style={{
                backgroundColor: canAfford ? '#e8f5e9' : '#f5f5f5',
                color: canAfford ? '#2e7d32' : '#757575',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '18px'
            }}>
                ${cost}
            </div>
        </div>
    );
};
