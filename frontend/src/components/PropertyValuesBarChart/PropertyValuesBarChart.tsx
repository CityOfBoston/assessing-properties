import React, { useRef, useEffect, useState } from 'react';
import styles from './PropertyValuesBarChart.module.scss';

interface YearValue {
  year: number;
  value: number;
}

interface PropertyValuesBarChartProps {
  title: string;
  value: string;
  data: YearValue[];
}

const formatValue = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const roundToNiceNumber = (value: number): number => {
  if (value >= 1000000) {
    return Math.round(value / 100000) * 100000;
  }
  if (value >= 100000) {
    return Math.round(value / 10000) * 10000;
  }
  if (value >= 10000) {
    return Math.round(value / 1000) * 1000;
  }
  return Math.round(value / 100) * 100;
};

const getStepSize = (range: number, numPoints: number): number => {
  // Calculate target number of ticks based on range and data points
  const rangeMagnitude = Math.floor(Math.log10(range));
  const baseTicks = Math.min(8, Math.max(3, Math.ceil(numPoints / 1.5)));
  const targetTicks = Math.min(baseTicks, Math.ceil(range / Math.pow(10, rangeMagnitude - 1)));
  
  const rawStep = range / (targetTicks - 1);
  
  // Find the appropriate magnitude for rounding
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalizedStep = rawStep / magnitude;
  
  // Round to nearest nice number (1, 2, 2.5, 5, 10)
  let niceStep;
  if (normalizedStep < 1.5) niceStep = 1;
  else if (normalizedStep < 2.25) niceStep = 2;
  else if (normalizedStep < 3.75) niceStep = 2.5;
  else if (normalizedStep < 7.5) niceStep = 5;
  else niceStep = 10;
  
  // Adjust step size based on range magnitude
  const step = niceStep * magnitude;
  const numTicks = Math.ceil(range / step);
  
  // If we get too few ticks, try smaller steps
  if (numTicks < 3) {
    const smallerMagnitude = magnitude / 2;
    const smallerStep = niceStep * smallerMagnitude;
    const smallerNumTicks = Math.ceil(range / smallerStep);
    
    // Only use smaller step if it gives us a reasonable number of ticks
    if (smallerNumTicks <= targetTicks) {
      return smallerStep;
    }
  }
  
  return step;
};

const formatYear = (year: number, isMobile: boolean): string => {
  if (isMobile) {
    // Convert to string and take last 2 digits
    return `'${year.toString().slice(-2)}`;
  }
  return year.toString();
};

const PropertyValuesBarChart: React.FC<PropertyValuesBarChartProps> = ({
  title,
  value,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate dynamic left margin based on the largest value's digit count
  const maxValue = Math.max(...data.map(item => item.value));
  const maxValueDigits = Math.floor(Math.log10(maxValue)) + 1;
  const dynamicLeftMargin = Math.max(60, 20 + (maxValueDigits * 8)); // Base 60px + 8px per digit
  
  // Chart dimensions
  const margin = { top: 20, right: 20, bottom: 20, left: dynamicLeftMargin };
  const chartHeight = 300 - margin.top - margin.bottom;
  const fixedHeight = 300;

  const [containerWidth, setContainerWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number } | null>(null);

  // Determine visible data based on container width
  const isMobile = containerWidth < 768;
  const visibleData = isMobile ? data.slice(-5) : data;

  // If not enough data, show message
  if (data.length <= 1) {
    return (
      <div className={styles.container} style={{ '--chart-max-width': `480px` } as React.CSSProperties}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.value}>{value}</div>
        <div className={styles.noHistory}>No History Available</div>
      </div>
    );
  }

  // Calculate bar dimensions
  const availableWidth = containerWidth - margin.left - margin.right;
  const barWidth = isMobile 
    ? Math.floor(availableWidth / visibleData.length * 0.8) // Use 80% of available width per bar on mobile
    : Math.min(80, Math.floor(availableWidth / visibleData.length * 0.6));
  const barGap = Math.floor(barWidth * 0.4);
  const startPadding = Math.floor(barWidth * 0.25);

  // Calculate chart dimensions
  const totalBarsWidth = visibleData.length * (barWidth + barGap) - barGap + startPadding * 2;
  const chartWidth = totalBarsWidth;
  const fixedWidth = chartWidth + margin.left + margin.right;

  // Handle resize
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  // Handle mouse events
  const handleMouseEnter = (event: React.MouseEvent | React.TouchEvent, value: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      value,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // Add a new handler for keyboard focus
  const handleBarFocus = (event: React.FocusEvent<SVGGElement>, value: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      value,
    });
  };

  // Calculate dimensions and scales
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  const padding = range * 0.15; // Increased padding from 0.1 to 0.15
  const yDomain = [minValue - (range * 0.33), maxValue + padding * 2]; // Double the top padding
  const step = getStepSize(range, data.length);

  // Scales
  const xScale = (index: number) => {
    const totalGapWidth = index * barGap;
    const totalBarWidth = index * barWidth;
    return margin.left + startPadding + totalBarWidth + totalGapWidth;
  };
  const yScale = (value: number) => {
    if (value === 0) return chartHeight + margin.top;
    const scale = (value - yDomain[0]) / (yDomain[1] - yDomain[0]);
    return margin.top + chartHeight * (1 - scale);
  };

  // Generate evenly spaced ticks
  const numTicks = Math.ceil((yDomain[1] - yDomain[0]) / step) + 1;
  let yTicks = Array.from(
    { length: numTicks },
    (_, i) => roundToNiceNumber(yDomain[0] + i * step)
  ).filter(tick => tick <= yDomain[1] && tick >= 0); // Filter out negative ticks and ensure within domain

  // Filter out ticks that would render under the x-axis
  yTicks = yTicks.filter(tick => yScale(tick) <= chartHeight + margin.top - 10);

  return (
    <div 
      className={styles.container}
      style={{ '--chart-max-width': `${fixedWidth}px` } as React.CSSProperties}
    >
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.value}>{value}</div>
      <div 
        className={styles.chartContainer} 
        ref={containerRef}
        role="region"
        aria-label="Property Value History Bar Chart"
      >
        <svg 
          width={containerWidth || fixedWidth} 
          height={fixedHeight}
        >
          {/* Background */}
          <rect
            x={0}
            y={0}
            width={containerWidth || fixedWidth}
            height={fixedHeight}
            fill="#F2F2F2"
          />

          {/* Y-axis */}
          <g>
            <line
              x1={margin.left}
              y1={margin.top}
              x2={margin.left}
              y2={chartHeight + margin.top}
              stroke="#D2D2D2"
            />
            {yTicks.map((tick, i) => (
              <g key={`tick-${i}`}>
                <line
                  x1={margin.left}
                  y1={yScale(tick)}
                  x2={margin.left - 5}
                  y2={yScale(tick)}
                  stroke="#D2D2D2"
                />
                <text
                  x={margin.left - 10}
                  y={yScale(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="#666"
                  fontSize={14}
                  fontFamily="Montserrat"
                >
                  {formatValue(tick)}
                </text>
              </g>
            ))}
          </g>

          {/* X-axis */}
          <g>
            <line
              x1={margin.left}
              y1={chartHeight + margin.top}
              x2={margin.left + (visibleData.length * (barWidth + barGap) - barGap + startPadding * 2)}
              y2={chartHeight + margin.top}
              stroke="#D2D2D2"
            />
            {visibleData.map((item, i) => (
              <text
                key={`x-tick-${i}`}
                x={xScale(i) + barWidth / 2}
                y={chartHeight + margin.top + 20}
                textAnchor="middle"
                fill="#666"
                fontSize={14}
                fontFamily="Montserrat"
              >
                {formatYear(item.year, isMobile)}
              </text>
            ))}
          </g>

          {/* Grid lines */}
          <g>
            {yTicks.map((tick, i) => (
              <line
                key={`grid-${i}`}
                x1={margin.left}
                y1={yScale(tick)}
                x2={margin.left + (visibleData.length * (barWidth + barGap) - barGap + startPadding * 2)}
                y2={yScale(tick)}
                stroke="#D2D2D2"
                strokeDasharray="3 3"
              />
            ))}
          </g>

          {/* Vertical lines between bars */}
          {visibleData.map((_, i) => (
            <line
              key={`vline-${i}`}
              x1={xScale(i) + barWidth + barGap / 2}
              y1={margin.top}
              x2={xScale(i) + barWidth + barGap / 2}
              y2={chartHeight + margin.top}
              stroke="#D2D2D2"
              strokeDasharray="3 3"
            />
          ))}

          {/* Bars */}
          {visibleData.map((item, i) => {
            const rawHeight = chartHeight + margin.top - yScale(item.value);
            const minBarHeight = 12; // Increased from 4px to 8px
            const barHeight = Math.max(rawHeight, minBarHeight);
            const barY = yScale(item.value) - (barHeight - rawHeight);
            return (
            <g
              key={`bar-${i}`}
              tabIndex={0}
              role="img"
              aria-label={`Year: ${item.year}, Value: ${formatValue(item.value)}`}
              onMouseEnter={(e) => handleMouseEnter(e, item.value)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={(e) => handleMouseEnter(e, item.value)}
              onTouchEnd={handleMouseLeave}
              onFocus={(e) => handleBarFocus(e, item.value)}
              onBlur={handleMouseLeave}
            >
              <rect
                x={xScale(i)}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={i === visibleData.length - 1 ? '#1871BD' : '#8A8A8A'}
                rx={4}
                ry={4}
              />
            </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className={styles.tooltip}
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
            }}
            aria-live="polite"
          >
            <p>{formatValue(tooltip.value)}</p>
          </div>
        )}
      </div>
      <div className={styles.legend} role="list">
        <div className={styles.legendItem} role="listitem">
          <div className={styles.legendPatch} style={{ backgroundColor: '#8A8A8A' }} />
          <span className={styles.legendLabel}>Historical Assessed Value(s)</span>
        </div>
        <div className={styles.legendItem} role="listitem">
          <div className={styles.legendPatch} style={{ backgroundColor: '#1871BD' }} />
          <span className={styles.legendLabel}>Current Assessed Value</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyValuesBarChart; 