import { useState } from 'react';
import PropertyDetailsSection from '../PropertyDetailsSection';
import PropertyValuesBarChart from '@components/PropertyValuesBarChart';
import ResponsiveTable from '@components/ResponsiveTable';
import styles from './PropertyValueSection.module.scss';
import { PropertyValueSectionData } from '@src/types';

export default function PropertyValueSection({ historicPropertyValues }: PropertyValueSectionData) {
  const [showAllValues, setShowAllValues] = useState(false);

  // Convert data object to array of {year, value} pairs and sort by year
  const sortedData = Object.entries(historicPropertyValues)
    .map(([year, value]) => ({ year: parseInt(year), value }))
    .sort((a, b) => a.year - b.year);

  // Get either all data or just the 5 most recent years
  const displayData = showAllValues ? sortedData : sortedData.slice(0, 5);

  // Format data for the table
  const tableData = [...displayData].reverse().map(({ year, value }) => ({
    'Year': year,
    'Assessed Value': value != null ? `$${value.toLocaleString()}` : 'N/A',
  }));

  // Get the most recent value for the chart title
  const mostRecentValue = sortedData[0]?.value;
  const formattedValue = mostRecentValue != null ? `$${mostRecentValue.toLocaleString()}` : 'N/A';

  return (
    <PropertyDetailsSection title="Property Value">
      <div>
        Your assessed property value is made up of two parts, the value of the building and land. 
        To calculate these values, assessors use a combination of three approaches, read more about{' '}
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href="https://www.boston.gov/departments/assessing/how-we-estimate-your-propertys-value"
        >
          how we estimate your property's value
        </a>.
      </div>
    
      <PropertyValuesBarChart
        title="Property Value History"
        value={formattedValue}
        data={sortedData.slice(0, 5)}
      />

      <div className={styles.valueHistory}>
        <h3>Value History</h3>
        <p><strong>Note:</strong> The assessed value is the actual billed assessment.</p>
        <ResponsiveTable data={tableData} />
        {sortedData.length > 5 && (
          <button
            className={styles.seeMoreButton}
            onClick={() => setShowAllValues(!showAllValues)}
          >
            {showAllValues ? 'See Less' : 'See More'}
            <span className={`${styles.arrow} ${showAllValues ? styles.up : ''}`} style={{ color: '#1871BD' }} />
          </button>
        )}
      </div>
    </PropertyDetailsSection>
  );
} 