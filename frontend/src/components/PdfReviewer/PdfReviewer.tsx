import React from 'react';
import IconButton from '@components/IconButton';
import styles from './PdfReviewer.module.scss';

export interface PdfReviewerProps {
  pdfUrl: string;
  fileName?: string;
  onPrint?: () => void;
  onDownload?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

/**
 * PdfReviewer Component
 * 
 * Displays a PDF in an embedded viewer with print and download controls.
 */
export default function PdfReviewer({
  pdfUrl,
  fileName = 'form.pdf',
  onPrint,
  onDownload,
  onBack,
  backLabel = 'Back to Property Details',
}: PdfReviewerProps) {
  const handlePrint = () => {
    // For Firebase Storage URLs with signed URLs, we need to open in new window
    // because cross-origin iframe doesn't allow .print() access
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    onPrint?.();
  };

  const handleDownload = () => {
    // Firebase Storage signed URLs already have download headers configured
    // We can trigger download directly without fetching
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = pdfUrl;
    link.download = fileName;
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    onDownload?.();
  };

  return (
    <div className={styles.pdfReviewerContainer}>
      <div className={styles.pdfViewerWrapper}>
        <iframe
          src={pdfUrl}
          className={styles.pdfViewer}
          title="PDF Form Preview"
          aria-label="Generated PDF form for review"
        />
      </div>

      <div className={styles.actionButtons}>
        {onBack && (
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
          >
            ← {backLabel}
          </button>
        )}
        <IconButton
          text="Print Form"
          onClick={handlePrint}
          variant="primary"
        />
        <IconButton
          text="Download Form"
          onClick={handleDownload}
          variant="outline"
        />
      </div>
    </div>
  );
}

