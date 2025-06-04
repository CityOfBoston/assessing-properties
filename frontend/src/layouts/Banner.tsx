export default function Banner() {
  return (
    <section className="cob-site-banner" aria-label="Official government website">
      <div className="cob-site-accordion">
        <header className="cob-site-banner__header">
          <div className="cob-site-banner__inner">
            <div className="cob-site-banner__content-wrapper">
              <div className="cob-site-banner__left">
                <img src="/cob-uswds/img/cob-boston-icon.svg" alt="" className="cob-site-banner__icon" />
                <span>An official website of the City of Boston.</span>
              </div>
              <div className="cob-site-banner__right">
                <button className="cob-site-banner__button" aria-expanded="false" aria-controls="cob-site-banner-content-306611154">
                  <span className="cob-site-banner__button-text">Here's how you know</span>
                  <img src="/cob-uswds/img/cob-angle-arrow-down.svg" alt="" className="cob-site-banner__toggle-icon-img" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="cob-site-banner__content" id="cob-site-banner-content-306611154" hidden>
            <div className="cob-site-banner__content-inner">
              <div className="cob-site-banner__info">
                <img src="/cob-uswds/img/cob-city-hall-icon.svg" alt="" className="cob-site-banner__info-icon" />
                <div>
                  <strong>Official websites use .boston.gov</strong>
                  <p>A .boston.gov website belongs to an official government organization in the City of Boston.</p>
                </div>
              </div>
              <div className="cob-site-banner__info">
                <img src="/cob-uswds/img/cob-https-lock-icon.svg" alt="" className="cob-site-banner__info-icon" />
                <div>
                  <strong>Secure .gov websites use HTTPS</strong>
                  <p>A lock or https:// means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </section>
  );
}
