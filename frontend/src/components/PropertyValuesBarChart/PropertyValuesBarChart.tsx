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

const PropertyValuesBarChart: React.FC<PropertyValuesBarChartProps> = ({
  title,
  value,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Chart dimensions
  const margin = { top: 0, right: 20, bottom: 20, left: 60 };
  const chartHeight = 300 - margin.top - margin.bottom;
  const fixedHeight = 300;

  const [containerWidth, setContainerWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number } | null>(null);

  // Determine visible data based on container width
  const isMobile = containerWidth < 768;
  const visibleData = isMobile ? data.slice(-5) : data;

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

  // Calculate dimensions and scales
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  const padding = range * 0.1;
  const yDomain = [minValue - (range * 0.33), maxValue + padding]; // Extend 1/3 below min
  const step = getStepSize(range, data.length);
  
  // Generate evenly spaced ticks
  const numTicks = Math.ceil(range / step) + 1;
  const yTicks = Array.from(
    { length: numTicks },
    (_, i) => roundToNiceNumber(minValue + i * step)
  );

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

  return (
    <div 
      className={styles.container}
      style={{ '--chart-max-width': `${fixedWidth}px` } as React.CSSProperties}
    >
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.value}>{value}</div>
      <div className={styles.chartContainer} ref={containerRef}>
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
                {item.year}
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
          {visibleData.map((item, i) => (
            <g
              key={`bar-${i}`}
              onMouseEnter={(e) => handleMouseEnter(e, item.value)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={(e) => handleMouseEnter(e, item.value)}
              onTouchEnd={handleMouseLeave}
            >
              <rect
                x={xScale(i)}
                y={yScale(item.value)}
                width={barWidth}
                height={chartHeight + margin.top - yScale(item.value)}
                fill={i === visibleData.length - 1 ? '#1871BD' : '#8A8A8A'}
                rx={4}
                ry={4}
              />
            </g>
          ))}
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
          >
            <p>{formatValue(tooltip.value)}</p>
          </div>
        )}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendPatch} style={{ backgroundColor: '#1871BD' }} />
          <span className={styles.legendLabel}>Assessed Value</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyValuesBarChart; 