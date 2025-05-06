import { useEffect, useRef } from "react";
import Banner from "../Banner";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar, { NavItem } from "../../components/Sidebar/Sidebar";
import PropertySearchModal from "../../components/PropertySearchModal";
import PropertySubHeader from "../../components/PropertySubHeader/PropertySubHeader";
import styles from "./PropertyDetailsPageLayout.module.scss";

interface PropertyDetailsPageLayoutProps {
  /**
   * The content to render in the main content area
   */
  children: React.ReactNode;

  /**
   * Property address to display in the sub-header
   */
  propertyAddress: string;

  /**
   * Optional URL for the map link
   */
  mapUrl?: string;

  /**
   * Optional handler for export button click
   */
  onExport?: () => void;

  /**
   * Optional handler for pay taxes button click
   */
  onPayTaxes?: () => void;

  /**
   * Sidebar title
   */
  sidebarTitle: string;

  /**
   * Navigation items for the sidebar
   */
  navItems: NavItem[];
}

/**
 * The PropertyDetailsPageLayout component provides a specialized layout for property detail pages.
 * 
 * It includes:
 * - City of Boston Banner
 * - Sticky Header that becomes fixed when scrolling past the banner
 * - Sticky Sidebar on the left side
 * - Property Sub-Header at the top of the content area
 * - Main Content Area with grid container layout
 * - Footer
 * 
 * ## Features
 * - **Sticky Header**: The header becomes fixed at the top of the viewport when scrolling past the banner
 * - **Sticky Sidebar**: The sidebar remains visible while scrolling through content
 * - **Sticky Property Sub-Header**: The property sub-header sticks to the top of the content area when scrolling
 * - **Responsive Design**: Works on all screen sizes
 * 
 * @example
 * ```tsx
 * import PropertyDetailsPageLayout from './layouts/PropertyDetailsPageLayout/PropertyDetailsPageLayout';
 * 
 * function PropertyDetailPage() {
 *   return (
 *     <PropertyDetailsPageLayout
 *       propertyAddress="123 Main St, Boston, MA 02108"
 *       sidebarTitle="Property Details"
 *       navItems={[
 *         { label: "Overview", url: "#overview", isActive: true },
 *         { label: "Assessment", url: "#assessment" },
 *       ]}
 *     >
 *       <div>
 *         <h1>Property Details Content</h1>
 *         <p>Your content goes here...</p>
 *       </div>
 *     </PropertyDetailsPageLayout>
 *   );
 * }
 * ```
 */
export default function PropertyDetailsPageLayout({ 
  children, 
  propertyAddress,
  mapUrl,
  onExport,
  onPayTaxes,
  sidebarTitle,
  navItems
}: PropertyDetailsPageLayoutProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const subHeaderRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
  // Store the original position of sidebar and subheader
  const sidebarOffsetTopRef = useRef<number>(0);
  const subHeaderOffsetTopRef = useRef<number>(0);
  
  useEffect(() => {
    // Set up element references and measurements
    const setupMeasurements = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
      
      if (sidebarRef.current) {
        const sidebarWidth = sidebarRef.current.getBoundingClientRect().width;
        document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
        
        // Store the original offset top for the sidebar
        const sidebarOffset = sidebarRef.current.getBoundingClientRect().top;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        sidebarOffsetTopRef.current = sidebarOffset + scrollTop;
      }
      
      if (subHeaderRef.current) {
        const subHeaderHeight = subHeaderRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--subheader-height', `${subHeaderHeight}px`);
        
        // Store the original offset top for the subheader
        const subHeaderOffset = subHeaderRef.current.getBoundingClientRect().top;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        subHeaderOffsetTopRef.current = subHeaderOffset + scrollTop;
      }
      
      const banner = document.querySelector('.cob-site-banner');
      if (banner) {
        const bannerHeight = banner.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
      }
    };

    const handleScroll = () => {
      // Get references to necessary elements
      const banner = document.querySelector('.cob-site-banner');
      if (!banner || !headerRef.current || !mainRef.current) return;
      
      const bannerHeight = banner.getBoundingClientRect().height;
      const headerHeight = headerRef.current.getBoundingClientRect().height;
      const scrollY = window.scrollY;
      
      // Handle header sticky behavior
      const headerShouldBeSticky = scrollY > bannerHeight;
      
      if (headerShouldBeSticky) {
        headerRef.current.classList.add('stickyActive');
        mainRef.current.classList.add('headerIsSticky');
      } else {
        headerRef.current.classList.remove('stickyActive');
        mainRef.current.classList.remove('headerIsSticky');
      }
      
      // Handle sidebar sticky behavior
      if (sidebarRef.current && contentAreaRef.current) {
        // Use stored original position
        const sidebarShouldBeSticky = scrollY + headerHeight > sidebarOffsetTopRef.current;
        
        if (sidebarShouldBeSticky) {
          if (!sidebarRef.current.classList.contains('stickyActive')) {
            sidebarRef.current.classList.add('stickyActive');
            contentAreaRef.current.classList.add('sidebarIsSticky');
            
            // Set the sidebar width to prevent it from collapsing when fixed
            const sidebarRect = sidebarRef.current.getBoundingClientRect();
            sidebarRef.current.style.width = `${sidebarRect.width}px`;
          }
        } else {
          if (sidebarRef.current.classList.contains('stickyActive')) {
            sidebarRef.current.classList.remove('stickyActive');
            contentAreaRef.current.classList.remove('sidebarIsSticky');
            sidebarRef.current.style.width = '';
          }
        }
      }
      
      // Handle sub-header sticky behavior
      if (subHeaderRef.current && contentWrapperRef.current) {
        // Use stored original position
        const subHeaderShouldBeSticky = scrollY + headerHeight > subHeaderOffsetTopRef.current;
        
        if (subHeaderShouldBeSticky) {
          if (!subHeaderRef.current.classList.contains('stickyActive')) {
            subHeaderRef.current.classList.add('stickyActive');
            contentWrapperRef.current.classList.add('subHeaderIsSticky');
            
            // Set the subHeader width to prevent it from collapsing when fixed
            const subHeaderRect = subHeaderRef.current.getBoundingClientRect();
            subHeaderRef.current.style.width = `${subHeaderRect.width}px`;
          }
        } else {
          if (subHeaderRef.current.classList.contains('stickyActive')) {
            subHeaderRef.current.classList.remove('stickyActive');
            contentWrapperRef.current.classList.remove('subHeaderIsSticky');
            subHeaderRef.current.style.width = '';
          }
        }
      }
      
      // Limit sidebar height if footer is in view
      if (footerRef.current && sidebarRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (footerRect.top < viewportHeight) {
          const distanceToFooter = footerRect.top - viewportHeight;
          sidebarRef.current.style.maxHeight = `calc(100vh - ${headerHeight}px + ${distanceToFooter}px)`;
        } else {
          sidebarRef.current.style.maxHeight = `calc(100vh - ${headerHeight}px)`;
        }
      }
    };
    
    // Set up initial measurements and handle initial positioning
    setupMeasurements();
    handleScroll();
    
    // Add event listeners for scroll and resize
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      setupMeasurements();
      handleScroll();
    });
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', setupMeasurements);
    };
  }, []);

  return (
    <div className={styles.pageLayout}>
      {/* Banner at the top */}
      <Banner />
      
      {/* Header will stick after banner scrolls out of view */}
      <div ref={headerRef} className={styles.headerWrapper}>
        <Header additionalContent={<PropertySearchModal />} />
      </div>
      
      {/* Main content with sidebar and content area */}
      <main ref={mainRef} className={styles.mainContainer}>
        {/* Sidebar on the left - will become sticky */}
        <div ref={sidebarRef} className={styles.sidebarWrapper}>
          <Sidebar 
            title={sidebarTitle}
            navItems={navItems}
          />
        </div>
        
        {/* Content area on the right */}
        <div ref={contentAreaRef} className={styles.contentArea}>
          {/* Property sub-header - will become sticky */}
          <div ref={subHeaderRef} className={styles.subHeaderWrapper}>
            <PropertySubHeader 
              address={propertyAddress}
              mapUrl={mapUrl}
              onExport={onExport}
              onPayTaxes={onPayTaxes}
            />
          </div>
          
          {/* Main content below sub-header */}
          <div ref={contentWrapperRef} className={styles.contentWrapper}>
            {children}
          </div>
        </div>
      </main>
      
      {/* Footer at the bottom */}
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
} 