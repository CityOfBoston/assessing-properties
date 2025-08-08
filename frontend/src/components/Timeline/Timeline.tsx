import React from 'react';
import styles from './Timeline.module.scss';

export interface Timepoint {
  label: string;
  date: Date;
}

export interface TimelineProps {
  timepoints: Timepoint[];
  selectedDate: Date;
  year: number;
  minDay: number;
  maxDay: number;
  selectedDay: number;
  timelineWidth: number;
}

function getDayOfYear(date: Date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start) / (1000 * 60 * 60 * 24)) + 1;
}

const Timeline: React.FC<TimelineProps> = ({ 
  timepoints, 
  selectedDate, 
  year, 
  minDay, 
  maxDay, 
  selectedDay,
  timelineWidth
}) => {

  // Find the current period for the selected date
  function getCurrentPeriod(date: Date) {
    let prev = timepoints[0];
    for (let i = 1; i < timepoints.length; i++) {
      if (date < timepoints[i].date) {
        return { from: prev, to: timepoints[i] };
      }
      prev = timepoints[i];
    }
    return { from: timepoints[timepoints.length - 1], to: null };
  }
  const currentPeriod = getCurrentPeriod(selectedDate);

  return (
    <>
      <div className={styles.mobilePeriodText}>
        {currentPeriod && currentPeriod.to && (
          <>Current period: <b>{currentPeriod.from.label}</b> → <b>{currentPeriod.to.label}</b></>
        )}
        {currentPeriod && !currentPeriod.to && (
          <>Current period: <b>{currentPeriod.from.label}</b> → <b>End of year</b></>
        )}
      </div>
      {timelineWidth > 0 && timepoints.map((tp, i) => {
        const day = getDayOfYear(tp.date);
        const thumbWidth = 18; // px, must match CSS
        const usableWidth = timelineWidth - thumbWidth;
        const leftPx = (usableWidth * (day - minDay)) / (maxDay - minDay) + thumbWidth / 2;
        const isMarker = Math.abs(day - selectedDay) < 2;
        // Strict zig-zag: even index above, odd below
        const isAbove = i % 2 === 0;
        let labelClass = styles.markerLabel + ' ' + (isAbove ? styles.labelAbove : styles.labelBelow) + ' ' + styles.hideOnMobile;
        let connectorClass = styles.connector + ' ' + (isAbove ? styles.connectorUp : styles.connectorDown);
        return (
          <div
            key={tp.label}
            className={styles.timelineMarker}
            style={{ left: leftPx }}
          >
            {isAbove && <div className={labelClass}>{tp.label}<br />{formatDate(tp.date)}</div>}
            <div className={styles.dot + (isMarker ? ' ' + styles.activeDot : '')} />
            <div className={connectorClass} />
            {!isAbove && <div className={labelClass}>{tp.label}<br />{formatDate(tp.date)}</div>}
          </div>
        );
      })}
    </>
  );
};

// Helper function to format date (copied from TimeChanger context)
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default Timeline; 