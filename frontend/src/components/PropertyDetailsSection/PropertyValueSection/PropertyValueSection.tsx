import { useState, useRef } from 'react';
import PropertyDetailsSection from '../PropertyDetailsSection';
import PropertyValuesBarChart from '@components/PropertyValuesBarChart';
import ResponsiveTable from '@components/ResponsiveTable';
import styles from './PropertyValueSection.module.scss';
import { PropertyValueSectionData } from '@src/types';

interface PropertyValueSectionProps extends PropertyValueSectionData {}

export default function PropertyValueSection(props: PropertyValueSectionProps) {
  const sectionData = props;
  const [showAllValues, setShowAllValues] = useState(false);
  const valueHistoryRef = useRef<HTMLDivElement>(null);
  const valueHistoryHeaderRef = useRef<HTMLHeadingElement>(null);

  // Convert data object to array of {year, value} pairs and sort by year
  const sortedData = Object.entries(sectionData.historicPropertyValues)
    .map(([year, value]) => ({ year: parseInt(year), value }))
    .sort((a, b) => a.year - b.year);

  // Get either all data or just the latest 5 years (most recent, descending order)
  const displayData = showAllValues ? [...sortedData].reverse() : [...sortedData].slice(-5).reverse();

  // Format data for the table (descending order: latest to earliest)
  const tableData = displayData.map(({ year, value }) => ({
    'Year': year,
    'Assessed Value': value != null ? `$${value.toLocaleString()}` : 'N/A',
  }));

  // Get the most recent value for the chart title
  const mostRecentValue = sortedData[sortedData.length - 1]?.value;
  const formattedValue = mostRecentValue != null ? `$${mostRecentValue.toLocaleString()}` : 'N/A';

  const handleSeeMoreLess = () => {
    if (showAllValues && valueHistoryHeaderRef.current) {
      // About to collapse, focus the header
      valueHistoryHeaderRef.current.focus();
    }
    setShowAllValues((prev) => !prev);
  };

  return (
    <PropertyDetailsSection title="Property Value">
      <p className={styles.description}>
      Your assessed property value is made up of two parts: the value of the 
      building and the value of the land. To calculate these values, assessors 
      use a combination of three approaches, read more about{' '}
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href="https://www.boston.gov/departments/assessing/how-we-estimate-your-propertys-value"
        >
          how we estimate your property's value
        </a>.
      </p>
    
      <PropertyValuesBarChart
        title="Property Value History"
        value={formattedValue}
        data={sortedData.slice(-5)}
      />

      <div className={styles.valueHistory} ref={valueHistoryRef}>
        <h3 tabIndex={-1} ref={valueHistoryHeaderRef}>VALUE HISTORY</h3>
        <p><strong>Note:</strong> The assessed value is the actual billed assessment.</p>
        <div className={styles.screenTable}>
          <ResponsiveTable data={tableData} />
        </div>
        <div className={styles.printTable}>
          <ResponsiveTable data={sortedData.slice().reverse().map(({ year, value }) => ({ 'Year': year, 'Assessed Value': value != null ? `$${value.toLocaleString()}` : 'N/A' }))} />
        </div>
        {sortedData.length > 5 && (
          <button
            className={styles.seeMoreButton}
            onClick={handleSeeMoreLess}
          >
            {showAllValues ? 'See Less' : 'See More'}
            <span className={`${styles.arrow} ${showAllValues ? styles.up : ''}`} style={{ color: '#1871BD' }} />
          </button>
        )}
      </div>
    </PropertyDetailsSection>
  );
} 