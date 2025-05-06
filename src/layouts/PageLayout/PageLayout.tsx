import { useEffect, useRef } from "react";
import Banner from "../Banner";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./PageLayout.module.scss";

interface PageLayoutProps {
  /**
   * The content to render in the main area
   */
  children: React.ReactNode;
  
  /**
   * Optional additional content to inject into the header
   */
  headerContent?: React.ReactNode;
}

/**
 * The PageLayout component provides a standardized layout structure for Boston.gov applications.
 * 
 * It includes:
 * - City of Boston Banner
 * - Sticky Header that becomes fixed when scrolling past the banner
 * - Main Content Area with grid container layout
 * - Footer
 * 
 * ## Features
 * - **Sticky Header**: The header becomes fixed at the top of the viewport when scrolling past the banner
 * - **Grid Container**: The main content area uses the USWDS grid container for proper spacing
 * - **Responsive Design**: Works on all screen sizes
 * 
 * ## Accessibility
 * The PageLayout component follows accessibility best practices:
 * - The banner includes proper ARIA attributes
 * - The navigation structure is keyboard navigable
 * - Proper heading hierarchy is maintained
 * 
 * @example
 * ```tsx
 * import PageLayout from './layouts/PageLayout/PageLayout';
 * 
 * function App() {
 *   return (
 *     <PageLayout>
 *       <div>
 *         <h1>Your Page Title</h1>
 *         <p>Your content goes here...</p>
 *       </div>
 *     </PageLayout>
 *   );
 * }
 * ```
 */
export default function PageLayout({ children, headerContent }: PageLayoutProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector('.cob-site-banner');
      if (!banner || !headerRef.current || !mainRef.current) return;
      
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
    <div className={styles.pageLayout}>
      {/* Banner at the top */}
      <Banner />
      
      {/* Header will stick after banner scrolls out of view */}
      <div ref={headerRef} className={styles.headerWrapper}>
        <Header additionalContent={headerContent} />
      </div>
      
      {/* Main content */}
      <main ref={mainRef}>
        {children}
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}