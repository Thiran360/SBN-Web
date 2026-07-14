import React, { useEffect } from 'react';
import '../styles/PrivacyPolicy.css'; // We'll create basic styling if needed

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-policy-page">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Effective Date: June 2, 2026</p>
      </div>

      <div className="privacy-content">
        <section>
          <h2>1. About Social Business Network (SBN)</h2>
          <p>
            Social Business Network (SBN) is a premier platform dedicated to providing networking, collaboration, and growth opportunities for young entrepreneurs and professionals.
          </p>
          <p>
            Our application is designed to help members efficiently connect, manage business networks, exchange referrals (Connects), and track transactions (G-Notes) to optimize their business operations.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We collect the following types of information to provide and improve our services:</p>
          
          <h3>A. Personal Information</h3>
          <ul>
            <li>Full Name</li>
            <li>Mobile Number</li>
            <li>Email Address</li>
            <li>Username and Password</li>
            <li>Company or Organization Details (Industry, Designation)</li>
            <li>Business Website and LinkedIn Profile</li>
          </ul>

          <h3>B. Networking and Business Data</h3>
          <p>
            Data related to your interactions within SBN is essential for the core functionality of the platform. We use this data to provide networking metrics and transaction histories.
          </p>
          <ul>
            <li><strong>Connections and Referrals:</strong> Records of business connects, referrals given and received.</li>
            <li><strong>Transactions (G-Notes):</strong> Financial values and transaction details exchanged between members.</li>
            <li><strong>Chapter/Table Affiliations:</strong> Your network memberships and meeting participation records.</li>
          </ul>

          <h3>C. Device and Usage Data</h3>
          <ul>
            <li>Device ID, Model, and Operating System</li>
            <li>IP Address and Network Information</li>
            <li>Login activity and Feature usage</li>
            <li>Performance and diagnostic data</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected data for the following purposes:</p>
          <ul>
            <li>To provide business networking and CRM services</li>
            <li>To track and display referral and transaction history</li>
            <li>To manage member accounts and chapter affiliations</li>
            <li>To improve application performance and features</li>
            <li>To provide customer support</li>
            <li>To ensure security and prevent unauthorized access</li>
            <li>To comply with legal requirements</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing and Disclosure</h2>
          <p>We do not sell or trade your personal data.</p>
          <p>We may share information only in the following cases:</p>
          <ul>
            <li><strong>Service Providers:</strong> Cloud hosting, API services, and analytics providers necessary for app operation.</li>
            <li><strong>Other Members:</strong> Basic business profile information is visible to other SBN members to facilitate networking.</li>
            <li><strong>Legal Requirements:</strong> When required by law or government authorities to comply with legal processes.</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset transfer.</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your data. All personal and transaction data is encrypted in transit (using SSL/HTTPS) to ensure its safety during transmission to our servers.
          </p>
          <p>
            However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>We retain user data only as long as necessary to:</p>
          <ul>
            <li>Provide services</li>
            <li>Maintain user accounts</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
          </ul>
          <p>After this period, data is securely deleted or anonymized.</p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Update or correct your information</li>
            <li>Request deletion of your account and data</li>
          </ul>
        </section>

        <section>
          <h2>8. Account & Data Deletion</h2>
          <p>
            Users have the right to request the complete and permanent deletion of their account and all associated networking data.
          </p>
          <p>
            <strong>How to Request Deletion:</strong> You can request data deletion directly within the application by navigating to Profile Settings, or by emailing us at <strong>info@socialbussinessnetwork.in</strong>.
          </p>
          <p>
            Upon verification, your data will be permanently deleted from our active systems within 30 days, unless a longer retention period is required by law.
          </p>
        </section>

        <section>
          <h2>9. Children’s Privacy</h2>
          <p>
            Social Business Network (SBN) services are intended for business and general users above 18 years of age.
          </p>
          <p>
            We do not knowingly collect personal data from children. If such data is identified, it will be deleted immediately.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of the application indicates acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy, you may contact us:</p>
          <div className="contact-details">
            <p><strong>Social Business Network (SBN)</strong></p>
            <p>506 Windfall, Sahar Plaza, J.B. Nagar,</p>
            <p>Andheri (EAST) Mumbai 400059</p>
            <p><strong>Phone:</strong> +91 93428 41619</p>
            <p><strong>Email:</strong> info@socialbussinessnetwork.in</p>
            <p><strong>Website:</strong> www.socialbussinessnetwork.in</p>
          </div>
        </section>
      </div>
    </div>
  );
}
