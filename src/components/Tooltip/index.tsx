import React, { FC } from 'react';
import styles from './styles.module.scss';

interface TooltipProps {
  hoverTime: number | null;
  videoLength: number;
  hoverChapter: { title: string; start: number; end: number } | null;
  formatTime: (sec: number) => string;
}

const Tooltip: FC<TooltipProps> = ({ hoverTime, videoLength, hoverChapter, formatTime }) => {
  if (hoverTime === null) return null;
  return (
    <div className={styles.hoverTooltip} style={{ left: `${(hoverTime / videoLength) * 100}%` }}>
      <div>{hoverChapter?.title || ''}</div>
      <div>{formatTime(hoverTime)}</div>
    </div>
  );
};

export default Tooltip;
