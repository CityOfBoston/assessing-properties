import { useEffect, useRef } from "react";
import Banner from "../Banner";
import Footer from "../Footer";
import Header from "../Header";
import SearchBackground from "@components/SearchBackground";
import styles from "./WelcomePageLayout.module.scss";

interface WelcomePageLayoutProps {
  /**
   * The content to render on top of the search background
   */
  children: React.ReactNode;
  
  /**
   * Optional additional content to inject into the header
   */
  headerContent?: React.ReactNode;
}

/**
 * The WelcomePageLayout component provides a layout structure similar to PageLayout
 * but with a full-height SearchBackground component in the content area.
 * 
 * It includes:
 * - City of Boston Banner
 * - Sticky Header that becomes fixed when scrolling past the banner
 * - Full-height SearchBackground with content overlaid
 * - Footer
 * 
 * ## Features
 * - **Sticky Header**: The header becomes fixed at the top of the viewport when scrolling past the banner
 * - **Full-height Background**: The search background fills the entire content area
 * - **Responsive Design**: Works on all screen sizes
 * 
 * @example
 * ```tsx
 * import WelcomePageLayout from './layouts/WelcomePageLayout/WelcomePageLayout';
 * 
 * function WelcomePage() {
 *   return (
 *     <WelcomePageLayout>
 *       <div>
 *         <h1>Welcome to Properties</h1>
 *         <p>Your content goes here...</p>
 *       </div>
 *     </WelcomePageLayout>
 *   );
 * }
 * ```
 */
export default function WelcomePageLayout({ children, headerContent }: WelcomePageLayoutProps) {
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
    <div className={styles.welcomePageLayout}>
      {/* Banner at the top */}
      <Banner />
      
      {/* Header will stick after banner scrolls out of view */}
      <div ref={headerRef} className={styles.headerWrapper}>
        <Header additionalContent={headerContent} />
      </div>
      
      {/* Main content with SearchBackground */}
      <main ref={mainRef} className={styles.main}>
        <SearchBackground>
          {children}
        </SearchBackground>
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
} 