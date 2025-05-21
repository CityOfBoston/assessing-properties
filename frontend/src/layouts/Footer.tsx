export default function Footer() {
  return (
    <div className="cob-slim-footer">
        <div className="cob-slim-footer__content">
            <div className="cob-slim-footer__left">
                    <img src="/cob-uswds/img/cob-footer-icon.png" alt="City of Boston" className="cob-slim-footer__icon" />
                </div>
                
                <nav className="cob-slim-footer__nav">
                <ul className="cob-slim-footer__nav-list">
                    <li><a href="https://www.boston.gov/departments/innovation-and-technology/terms-use-and-privacy-policy-city-boston-digital-services">PRIVACY POLICY</a></li>
                    <li><a href="https://www.boston.gov/departments/mayors-office/contact-boston-city-hall">CONTACT US</a></li>
                    <li><a href="https://www.boston.gov/career-center">JOBS</a></li>
                    <li><a href="https://www.boston.gov/departments/public-records">PUBLIC RECORDS</a></li>
                    <li><a href="https://www.boston.gov/departments/language-and-communications-access/notice-accommodations">LANGUAGE AND DISABILITY ACCESS</a></li>
                </ul> 
                </nav>

                <div className="cob-slim-footer__right">
                <a href="http://www.cityofboston.gov/311/" className="cob-slim-footer__report">
                    <span>Report an issue</span>
                    <img src="/cob-uswds/img/cob-311.svg" alt="311" className="cob-slim-footer__311-icon" />
                </a>
            </div>
        </div>
    </div>
  );
}