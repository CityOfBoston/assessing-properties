import { useEffect, useRef } from "react";
import Banner from "../Banner";
import Footer from "../Footer";
import Header from "../Header";
import SearchBackground from "../../components/SearchBackground";
import styles from "./WelcomePageLayout.module.scss";

interface WelcomePageLayoutProps {
  /**
   * The welcome content to render in the search background area
   */
  welcomeContent: React.ReactNode;
  
  /**
   * The search results to render in the main content area
   */
  searchResults: React.ReactNode | null;
  
  /**
   * Optional additional content to inject into the header
   */
  headerContent?: React.ReactNode;
}

/**
 * The WelcomePageLayout component provides a specialized layout structure for the welcome page.
 * 
 * It includes:
 * - City of Boston Banner
 * - Sticky Header that becomes fixed when scrolling past the banner
 * - Search Background with welcome content
 * - Main Content Area with grid container layout for search results
 * - Footer
 * 
 * ## Features
 * - **Sticky Header**: The header becomes fixed at the top of the viewport when scrolling past the banner
 * - **Search Background**: Full-width background with welcome content
 * - **Grid Container**: The main content area uses the USWDS grid container for proper spacing
 * - **Responsive Design**: Works on all screen sizes
 * - **Full Height**: When search results are empty, the layout fills the viewport height
 * 
 * @example
 * ```tsx
 * import WelcomePageLayout from './layouts/WelcomePageLayout/WelcomePageLayout';
 * 
 * function WelcomePage() {
 *   return (
 *     <WelcomePageLayout
 *       welcomeContent={<WelcomeContent />}
 *       searchResults={<SearchResults />}
 *     />
 *   );
 * }
 * ```
 */
export default function WelcomePageLayout({ 
  welcomeContent, 
  searchResults, 
  headerContent 
}: WelcomePageLayoutProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector('.cob-site-banner');
      if (!banner || !headerRef.current || !mainRef.current) return;
      
      const bannerHeight = banner.getBoundingClientRect().height;
      const searchBackground = document.querySelector('.search-background');
      const searchBackgroundBottom = searchBackground ? 
        searchBackground.getBoundingClientRect().bottom : 0;
      
      // Apply sticky behavior when scrolled past the banner and search background
      if (window.scrollY > bannerHeight && window.scrollY > searchBackgroundBottom) {
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
    <div className={styles.welcomePageLayout}>
      {/* Banner at the top */}
      <Banner />
      
      {/* Header will stick after banner scrolls out of view */}
      <div ref={headerRef} className={styles.headerWrapper}>
        <Header additionalContent={headerContent} />
      </div>
      
      {/* Search Background with welcome content */}
      <SearchBackground>
        {welcomeContent}
      </SearchBackground>
      
      {/* Main content for search results */}
      <main ref={mainRef} className={styles.mainContent}>
        {searchResults}
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
} 