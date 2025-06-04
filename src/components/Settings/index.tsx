import React, { useState, FC } from 'react';
import styles from './styles.module.scss';
import SettingsIcon from '../../assets/Settings';

interface SettingsProps {
  qualityLevels: any[];
  currentLevel: number;
  onQualityChange: (levelIndex: number) => void;
}

const Settings: FC<SettingsProps> = ({ qualityLevels, currentLevel, onQualityChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.settingsWrapper}>
      <button onClick={handleClick} className={styles.controlBtn}>
        <SettingsIcon />
      </button>
      {isOpen && (
        <div className={styles.settingsMenu}>
          {qualityLevels.map((level, idx) => (
            <button
              key={idx}
              className={`${styles.settingsItem} ${currentLevel === idx ? styles.active : ''}`}
              onClick={() => {
                onQualityChange(idx);
                setIsOpen(false);
              }}
            >
              {level.height}p
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Settings;
