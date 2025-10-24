import { useEffect, useRef, useState } from "react";
import Banner from "../Banner";
import Footer from "../Footer";
import Header from "../Header";
import SearchBackground from "@components/SearchBackground";
import styles from "./SearchResultsLayout.module.scss";
import backToTop from "../../assets/back_to_top.png";

interface SearchResultsLayoutProps {
  /**
   * The content to render in the search background area
   */
  searchContent: React.ReactNode;

  /**
   * The content to render below the search background
   */
  children: React.ReactNode;
  
  /**
   * Optional additional content to inject into the header
   */
  headerContent?: React.ReactNode;
}

/**
 * The SearchResultsLayout component provides a layout structure similar to PageLayout
 * but with a stacked SearchBackground and content area.
 * 
 * It includes:
 * - City of Boston Banner
 * - Sticky Header that becomes fixed when scrolling past the banner
 * - SearchBackground area that sizes to its content
 * - Additional content area below with grid container
 * - Footer
 * 
 * ## Features
 * - **Sticky Header**: The header becomes fixed at the top of the viewport when scrolling past the banner
 * - **Stacked Layout**: SearchBackground followed by additional content
 * - **Grid Container**: The additional content area uses the USWDS grid container
 * - **Responsive Design**: Works on all screen sizes
 * 
 * @example
 * ```tsx
 * import SearchResultsLayout from './layouts/SearchResultsLayout/SearchResultsLayout';
 * 
 * function SearchResultsPage() {
 *   return (
 *     <SearchResultsLayout
 *       searchContent={<SearchBar />}
 *     >
 *       <div>Results content goes here...</div>
 *     </SearchResultsLayout>
 *   );
 * }
 * ```
 */
export default function SearchResultsLayout({ 
  searchContent, 
  children, 
  headerContent 
}: SearchResultsLayoutProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector('.cob-site-banner');
      if (!banner || !headerRef.current || !mainRef.current) return;
      
      // Show back to top button after scrolling 500px
      setShowBackToTop(window.scrollY > 500);
      
      const bannerHeight = banner.getBoundingClientRect().height;
      
      // Apply sticky behavior when scrolled past the banner
      if (window.scrollY > bannerHeight) {
        headerRef.current.classList.add('stickyActive');
        mainRef.current.classList.add('headerIsSticky');
      } else {
        headerRef.current.classList.remove('stickyActive');
        mainRef.current.classList.remove('headerIsSticky');
      }
    };
    
    // Set elements heights as CSS variables for layout calculations
    if (headerRef.current) {
      const headerHeight = headerRef.current.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
    
    const banner = document.querySelector('.cob-site-banner');
    if (banner) {
      const bannerHeight = banner.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
    }
    
    const footer = document.querySelector('.cob-slim-footer');
    if (footer) {
      const footerHeight = footer.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    }
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
      handleScroll();
      
      // Update height variables on resize
      if (headerRef.current) {
        const headerHeight = headerRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
      
      const banner = document.querySelector('.cob-site-banner');
      if (banner) {
        const bannerHeight = banner.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
      }
      
      const footer = document.querySelector('.cob-slim-footer');
      if (footer) {
        const footerHeight = footer.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
      }
    });
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className={styles.searchResultsLayout}>
      {/* Banner at the top */}
      <Banner />
      
      {/* Header will stick after banner scrolls out of view */}
      <div ref={headerRef} className={styles.headerWrapper}>
        <Header additionalContent={headerContent} />
      </div>
      
      {/* Main content with stacked SearchBackground and additional content */}
      <main ref={mainRef} className={styles.main}>
        {/* Search background area */}
        <SearchBackground>
          {searchContent}
        </SearchBackground>
        
        {/* Additional content area with grid container */}
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
      
      {/* Footer at the bottom */}
      <Footer />

      {/* Back to top button */}
      <button
        className={`${styles.backToTop} ${showBackToTop ? styles.visible : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <img src={backToTop} alt="Back to top" />
      </button>
    </div>
  );
} 