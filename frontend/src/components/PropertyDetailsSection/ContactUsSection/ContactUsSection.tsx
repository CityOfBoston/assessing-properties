/**
 * ContactUsSection component displays contact information and support resources
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import styles from './ContactUsSection.module.scss';
import ReactMarkdown from 'react-markdown';
import { getComponentText } from '@utils/contentMapper';

interface ContactUsSectionProps {
  title: string;
}

export default function ContactUsSection({ title }: ContactUsSectionProps) {
  const content = getComponentText('ContactUsSection');
  const { paragraphs } = content;


  return (
    <PropertyDetailsSection title={title}>
      <div className={styles.container}>
        <div className={styles.paragraph}>
          <ReactMarkdown>
            {paragraphs.exemptions.text}
          </ReactMarkdown>
          {' '}
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href={paragraphs.exemptions.link.url}
          >
            {paragraphs.exemptions.link.text}
          </a>
          {' '}
          {paragraphs.exemptions.suffix}
          {' '}
          <a
            href={paragraphs.exemptions.phone.url}
            className="usa-link"
            aria-label={paragraphs.exemptions.phone.label}
          >
            {paragraphs.exemptions.phone.text}
          </a>
          {' '}
          or emailing
          {' '}
          <a
            href={paragraphs.exemptions.email.url}
            className="usa-link"
          >
            {paragraphs.exemptions.email.text}
          </a>
          .
        </div>

        <div className={styles.paragraph}>
          <ReactMarkdown>
            {paragraphs.billing.text}
          </ReactMarkdown>
          {' '}
          <a
            href={paragraphs.billing.phone.url}
            className="usa-link"
            aria-label={paragraphs.billing.phone.label}
          >
            {paragraphs.billing.phone.text}
          </a>
          .
        </div>

        <div className={styles.paragraph}>
          <ReactMarkdown>
            {paragraphs.values.text}
          </ReactMarkdown>
          {' '}
          <a
            href={paragraphs.values.phone.url}
            className="usa-link"
            aria-label={paragraphs.values.phone.label}
          >
            {paragraphs.values.phone.text}
          </a>
          .
        </div>

        <div className={styles.paragraph}>
          <ReactMarkdown>
            {paragraphs.ownership.text}
          </ReactMarkdown>
          {' '}
          <a
            href={paragraphs.ownership.phone.url}
            className="usa-link"
            aria-label={paragraphs.ownership.phone.label}
          >
            {paragraphs.ownership.phone.text}
          </a>
          .
        </div>
      </div>
    </PropertyDetailsSection>
  );
} 