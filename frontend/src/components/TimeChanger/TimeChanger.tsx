import React, { useMemo, useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './TimeChanger.module.scss';
import { useDateContext } from '@src/hooks/useDateContext';
import { getAllTimepoints } from '@src/utils/periods';
import Timeline from '@src/components/Timeline';



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
  const { date: selectedDate, setDate, resetDate, formatDate, parseDate } = useDateContext();
  const year = 2025; // Fixed to 2025 only
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
      setDate(getDateFromDayOfYear(year, pendingDay));
      setPendingDay(null);
      setExpanded(false); // Auto-collapse after confirming
    }
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const parsedDate = parseDate(val);
      // Only allow 2025 dates
      if (parsedDate.getFullYear() === 2025) {
        setDate(parsedDate);
      } else {
        // If not 2025, reset to today's date in 2025
        const today = new Date();
        const todayIn2025 = new Date(2025, today.getMonth(), today.getDate());
        setDate(todayIn2025);
      }
    } else {
      resetDate();
    }
    setPendingDay(null);
  };

  const handleReset = () => {
    // Reset to today's date in 2025
    const today = new Date();
    const todayIn2025 = new Date(2025, today.getMonth(), today.getDate());
    setDate(todayIn2025);
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
            min="2025-01-01"
            max="2025-12-31"
            className={styles.dateInput + (flash ? ' ' + styles.flash : '')}
            aria-label="Custom date"
          />
          <button id="time_reset_button" className={styles.resetButton} onClick={handleReset}>
            Reset
          </button>
          <button id="time_expand_button" className={styles.expandButton} onClick={() => setExpanded(true)} aria-label="Expand timeline">
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
        <button id="time_collapse_button" className={styles.collapseButton} onClick={handleCollapse} aria-label="Collapse timeline">
          <img src='/cob-uswds/img/usa-icons/expand_more.svg' alt="Collapse" width={28} height={28} style={{ verticalAlign: 'middle' }} />
        </button>
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
          <Timeline
            timepoints={timepoints}
            selectedDate={effectiveDate}
            year={year}
            minDay={minDay}
            maxDay={maxDay}
            selectedDay={effectiveDay}
            timelineWidth={timelineWidth}
          />
        </div>
      </div>
      <div className={styles.confirmButtonContainer}>
        {showConfirm && (
          <button id="time_confirm_button" className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Date
          </button>
        )}
      </div>
      <div className={styles.customRow}>
        <input
          type="date"
          value={formatDate(effectiveDate)}
          onChange={handleDateInput}
          min="2025-01-01"
          max="2025-12-31"
          className={styles.dateInput + (flash ? ' ' + styles.flash : '')}
          aria-label="Custom date"
        />
        <button id="time_reset_button" className={styles.resetButton} onClick={handleReset}>
          Reset to Today
        </button>
        </div>
      </div>
    </div>
  );
};

export default TimeChanger; 