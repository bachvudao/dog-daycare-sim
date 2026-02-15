import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { GameEvent } from '../types/events';

interface EventBannerProps {
    event: GameEvent;
}

export const EventBanner: React.FC<EventBannerProps> = ({ event }) => {
    const { t } = useLanguage();
    return (
        <div style={{
            backgroundColor: event.color,
            color: 'white',
            padding: '12px 24px',
            borderRadius: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            animation: 'slideDown 0.5s ease-out'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '32px' }}>{event.icon}</span>
                <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{t(`event.${event.type}.name`)}</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>{t(`event.${event.type}.desc`)}</p>
                </div>
            </div>
            <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '4px 12px',
                borderRadius: '8px',
                minWidth: '60px',
                textAlign: 'center'
            }}>
                {Math.ceil(event.duration)}s
            </div>
            <style>{`
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
