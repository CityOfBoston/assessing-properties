import React from 'react';
import PropertyDetailsCard from '../PropertyDetailsCard';
import styles from './PropertyDetailsCardGroup.module.scss';

interface PropertyDetailsCardGroupProps {
  cards: Array<{
    icon?: React.ReactNode;
    header: string;
    value: string;
  }>;
  maxCardsPerRow?: number;
}

const PropertyDetailsCardGroup: React.FC<PropertyDetailsCardGroupProps> = ({
  cards,
  maxCardsPerRow = 4,
}) => {
  return (
    <div 
      className={styles.group}
      style={{
        '--cards-per-row': maxCardsPerRow,
      } as React.CSSProperties}
    >
      {cards.map((card, index) => (
        <div key={`${card.header}-${index}`} className={styles.cardWrapper}>
          <PropertyDetailsCard
            icon={card.icon}
            header={card.header}
            value={card.value}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyDetailsCardGroup; 