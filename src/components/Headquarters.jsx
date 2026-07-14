import '../styles/Headquarters.css';

export default function Headquarters() {
  return (
    <section className="headquarters">
      <div className="container hq-content">
        <div className="hq-image">
          <img src="/images/sbn_hq_building.png" alt="SBN National Headquarters Building" loading="lazy" />
        </div>
        <div className="hq-text">
          <h2>National Headquarters</h2>
          <p className="hq-address">
            506 Windfall, Sahar Plaza, J.B. Nagar, Andheri (EAST) Mumbai 400059
          </p>
          <div className="hq-contact">
            <div className="contact-item">
              <span className="icon">📞</span>
              <a href="tel:9342841619">93428 41619</a>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <a href="mailto:info@socialbussinessnetwork.in">info@socialbussinessnetwork.in</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
