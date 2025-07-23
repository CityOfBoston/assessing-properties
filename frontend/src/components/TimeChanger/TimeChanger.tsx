import React, { useMemo, useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './TimeChanger.module.scss';
import { useSearchParams } from 'react-router-dom';
import { getAllTimepoints } from '@src/utils/periods';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(str: string) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getDayOfYear(date: Date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start) / (1000 * 60 * 60 * 24)) + 1;
}

function getDateFromDayOfYear(year: number, day: number) {
  const d = new Date(year, 0, 1);
  d.setDate(d.getDate() + day - 1);
  return d;
}

export interface TimeChangerProps {}

const TimeChanger: React.FC<TimeChangerProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentDateStr = searchParams.get('date');
  const today = new Date();
  const selectedDate = currentDateStr ? parseDate(currentDateStr) : today;
  const year = selectedDate.getFullYear();
  const timepoints = useMemo(() => {
    const tps = getAllTimepoints(year);
    return [...tps].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [year]);
  const minDay = 1;
  const maxDay = getDayOfYear(new Date(year, 11, 31));
  const selectedDay = getDayOfYear(selectedDate);

  // Local state for pending slider value
  const [pendingDay, setPendingDay] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false); // collapsed by default
  const [isExiting, setIsExiting] = useState(false); // for exit animation
  const effectiveDay = pendingDay !== null ? pendingDay : selectedDay;
  const effectiveDate = getDateFromDayOfYear(year, effectiveDay);
  const showConfirm = pendingDay !== null && pendingDay !== selectedDay;

  // Ref and state for timeline width and height
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState(0);

  useLayoutEffect(() => {
    if (!expanded) return;
    function updateDimensions() {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth);
        // Calculate required height based on number of timepoints
        const numTimepoints = timepoints.length;
        const baseHeight = 120; // Base height for timeline
        const labelHeight = 60; // Height for labels (above/below)
        const connectorHeight = 35; // Height for connectors
        const totalHeight = Math.max(baseHeight, numTimepoints * labelHeight + connectorHeight);
        setTimelineHeight(totalHeight);
      }
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [expanded, timepoints.length]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingDay(parseInt(e.target.value, 10));
  };

  const handleConfirm = () => {
    if (pendingDay !== null) {
      setSearchParams(prev => {
        prev.set('date', formatDate(getDateFromDayOfYear(year, pendingDay)));
        return prev;
      }, { replace: true });
      setPendingDay(null);
      setExpanded(false); // Auto-collapse after confirming
    }
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      setSearchParams(prev => {
        prev.set('date', val);
        return prev;
      }, { replace: true });
    } else {
      setSearchParams(prev => {
        prev.delete('date');
        return prev;
      }, { replace: true });
    }
    setPendingDay(null);
  };

  const handleReset = () => {
    setSearchParams(prev => {
      prev.delete('date');
      return prev;
    }, { replace: true });
    setPendingDay(null);
    setExpanded(false); // Auto-collapse after reset
  };

  const handleCollapse = () => {
    // Reset pending slider value when collapsing without confirming
    setPendingDay(null);
    setIsExiting(true);
    // Wait for animation to complete before actually collapsing
    setTimeout(() => {
    setExpanded(false);
      setIsExiting(false);
    }, 300); // Match animation duration
  };

  // Handle clicking outside the TimeChanger to close it
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop (not the TimeChanger content)
    if (e.target === e.currentTarget) {
      handleCollapse();
    }
  };

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
  const currentPeriod = getCurrentPeriod(effectiveDate);

  const [flash, setFlash] = useState(false);
  const prevDateRef = useRef(formatDate(selectedDate));

  // Trigger flash animation when the selected date changes (official update)
  useEffect(() => {
    const currentDate = formatDate(selectedDate);
    if (prevDateRef.current !== currentDate) {
      setFlash(true);
      prevDateRef.current = currentDate;
    }
  }, [selectedDate]);

  // Remove flash after animation
  useEffect(() => {
    if (flash) {
      const timeout = setTimeout(() => setFlash(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [flash]);

  // Expanded view: full timeline
  if (!expanded) {
    return (
      <div className={styles.timeChangerCollapsed}>
        <div className={styles.collapsedRow}>
          <input
            type="date"
            value={formatDate(effectiveDate)}
            onChange={handleDateInput}
            className={styles.dateInput + (flash ? ' ' + styles.flash : '')}
            aria-label="Custom date"
          />
          <button className={styles.resetButton} onClick={handleReset}>
            Reset
          </button>
          <button className={styles.expandButton} onClick={() => setExpanded(true)} aria-label="Expand timeline">
            <img src="/cob-uswds/img/usa-icons/zoom_out_map.svg" alt="Expand" width={28} height={28} style={{ verticalAlign: 'middle' }} />
          </button>
        </div>
      </div>
    );
  }

  // Expanded view: full timeline
  return (
    <div className={`${styles.timeChangerBackdrop} ${isExiting ? styles.backdropExiting : ''}`} onClick={handleBackdropClick}>
      <div className={`${styles.timeChanger} ${isExiting ? styles.timeChangerExiting : ''}`}>
      <div className={styles.label}>
        Test Date: <span style={{fontWeight:400}}>{formatDate(effectiveDate)}</span>
        <button className={styles.collapseButton} onClick={handleCollapse} aria-label="Collapse timeline">
          <img src='/cob-uswds/img/usa-icons/expand_more.svg' alt="Collapse" width={28} height={28} style={{ verticalAlign: 'middle' }} />
        </button>
      </div>
      <div className={styles.mobilePeriodText}>
        {currentPeriod && currentPeriod.to && (
          <>Current period: <b>{currentPeriod.from.label}</b> → <b>{currentPeriod.to.label}</b></>
        )}
        {currentPeriod && !currentPeriod.to && (
          <>Current period: <b>{currentPeriod.from.label}</b> → <b>End of year</b></>
        )}
      </div>
      <div className={styles.timelineScroll}>
          <div 
            className={styles.timelineContainer} 
            ref={timelineRef}
            style={{ minHeight: timelineHeight > 0 ? `${timelineHeight}px` : undefined }}
          >
          <div className={styles.timelineStrip} />
          <input
            type="range"
            min={minDay}
            max={maxDay}
            value={effectiveDay}
            onChange={handleSliderChange}
            className={styles.slider}
            aria-label="Select test date"
          />
          {timelineWidth > 0 && timepoints.map((tp, i) => {
            const day = getDayOfYear(tp.date);
            const thumbWidth = 18; // px, must match CSS
            const usableWidth = timelineWidth - thumbWidth;
            const leftPx = (usableWidth * (day - minDay)) / (maxDay - minDay) + thumbWidth / 2;
            const isMarker = Math.abs(day - effectiveDay) < 2;
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
        </div>
      </div>
      <div className={styles.confirmButtonContainer}>
        {showConfirm && (
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Date
          </button>
        )}
      </div>
      <div className={styles.customRow}>
        <input
          type="date"
          value={formatDate(effectiveDate)}
          onChange={handleDateInput}
          className={styles.dateInput + (flash ? ' ' + styles.flash : '')}
          aria-label="Custom date"
        />
        <button className={styles.resetButton} onClick={handleReset}>
          Reset to Today
        </button>
        </div>
      </div>
    </div>
  );
};

export default TimeChanger; 