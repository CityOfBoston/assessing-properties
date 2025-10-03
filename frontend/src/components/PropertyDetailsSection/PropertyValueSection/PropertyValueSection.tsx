import { useState, useRef } from 'react';
import PropertyDetailsSection from '../PropertyDetailsSection';
import PropertyValuesBarChart from '@components/PropertyValuesBarChart';
import ResponsiveTable from '@components/ResponsiveTable';
import styles from './PropertyValueSection.module.scss';
import sharedStyles from '../PropertyDetailsSection.module.scss';
import { PropertyValueSectionData } from '@src/types';
import { getComponentText } from '@utils/contentMapper';

interface PropertyValueSectionProps extends PropertyValueSectionData {
  title: string;
}

export default function PropertyValueSection(props: PropertyValueSectionProps) {
  const sectionData = props;
  const content = getComponentText('PropertyValueSection');
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
    'Fiscal Year': year.toString(),
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
    <PropertyDetailsSection title={props.title}>
      <div className={sharedStyles.paragraph}>
        {content.description}{' '}
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href={content.howWeEstimateLink.url}
        >
          {content.howWeEstimateLink.text}
        </a>.
      </div>
    
      <PropertyValuesBarChart
        title={content.chart.title}
        value={formattedValue}
        data={sortedData.slice(-5)}
      />

      <div className={styles.valueHistory} ref={valueHistoryRef}>
        <h3 tabIndex={-1} ref={valueHistoryHeaderRef}>{content.valueHistory.title}</h3>
        <div className={sharedStyles.paragraph}><strong>Note:</strong> {content.valueHistory.note}</div>
        <div className={styles.screenTable}>
          <ResponsiveTable data={tableData} />
        </div>
        <div className={styles.printTable}>
          <ResponsiveTable data={sortedData.slice().reverse().map(({ year, value }) => ({ 'Fiscal Year': `FY${(year + 1).toString().slice(-2)}`, 'Assessed Value': value != null ? `$${value.toLocaleString()}` : 'N/A' }))} />
        </div>
        {sortedData.length > 5 && (
          <button
            className={styles.seeMoreButton}
            onClick={handleSeeMoreLess}
          >
            {showAllValues ? content.valueHistory.buttons.seeLess : content.valueHistory.buttons.seeMore}
            <span className={`${styles.arrow} ${showAllValues ? styles.up : ''}`} style={{ color: '#1871BD' }} />
          </button>
        )}
      </div>
    </PropertyDetailsSection>
  );
} 