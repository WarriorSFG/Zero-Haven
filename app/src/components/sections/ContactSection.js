import React, { useState, useEffect } from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

// ── ANOMALY 1: "contact_wrong_email"
//   The real email is samarthgupta9999@gmail.com
//   The displayed email is samarthgupta9999@gmai1.com (lowercase L instead of l)
//   Clicking the email link triggers the find.
//
// ── ANOMALY 2: "contact_hidden_message"
//   The lore block (LOG_ENTRY) is always rendered but hidden in plain sight
//   — it appears at horror level 0 in near-invisible color #111 on #000 bg.
//   Clicking the barely-visible block discovers it.

const REAL_EMAIL    = 'samarthgupta9999@gmail.com';
const ANOMALY_EMAIL = 'samarthgupta9999@ggmai1.com'; // lowercase L → 1

const ContactSection = () => {
  const { horrorLevel, escalate, executeJumpscare, discoverAnomaly, foundAnomalies } = useHorror();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [placeholderName, setPlaceholderName]       = useState('YOUR_NAME');
  const [placeholderEmail, setPlaceholderEmail]     = useState('YOUR_EMAIL');
  const [placeholderMessage, setPlaceholderMessage] = useState('INSERT YOUR MESSAGE HERE');

  useEffect(() => {
    if (horrorLevel >= 5) {
      setPlaceholderName('I_ALREADY_KNOW');
      setPlaceholderEmail('NO_ESCAPE@VOID.NULL');
      setPlaceholderMessage('IT IS TOO LATE TO ASK FOR ANYTHING');
    } else if (horrorLevel >= 3) {
      setPlaceholderName('IDENTIFY_YOURSELF');
      setPlaceholderEmail('SIGNAL_ADDRESS');
      setPlaceholderMessage('STATE YOUR PURPOSE... IF YOU DARE');
    }
  }, [horrorLevel]);

  const handleSubmit = () => {
    if (submitting) return;
    setSubmitting(true);
    escalate('submit');
    setTimeout(() => executeJumpscare(), 1200);
  };

  const handleFieldFocus = () => escalate('focus');

  // Lore block is always in the DOM — but near-invisible at horror 0
  // and only turns readable at horror 4+
  const loreBaseColor = horrorLevel >= 4 ? '#333' : '#111';
  const loreDangerColor = horrorLevel >= 6 ? 'var(--blood-bright)' : '#1a0000';

  return (
    <section className="section contact-section">
      <div className="section-header">
        <span className="section-tag">{"// OPEN_CHANNEL"}</span>
        <h2 className="section-title">
          {horrorLevel >= 5 ? 'NO_ESCAPE' : 'CONTACT'}
        </h2>
        <div className="section-divider" />
      </div>

      {horrorLevel >= 3 && (
        <div className="contact-warning">
          <span className="warn-icon">▲</span>
          {horrorLevel >= 6
            ? 'TRANSMISSION CANNOT BE STOPPED. IT IS LISTENING.'
            : 'WARNING: All transmissions are being monitored.'}
        </div>
      )}

      <div className="contact-layout">
        {/* Form */}
        <div className="contact-form">
          <div className="form-group">
            <label className="form-label">IDENTIFIER //</label>
            <input
              className={`form-input ${horrorLevel >= 5 ? 'corrupted-input' : ''}`}
              type="text"
              placeholder={placeholderName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={handleFieldFocus}
            />
          </div>

          <div className="form-group">
            <label className="form-label">SIGNAL_FREQ //</label>
            <input
              className={`form-input ${horrorLevel >= 5 ? 'corrupted-input' : ''}`}
              type="email"
              placeholder={placeholderEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFieldFocus}
            />
          </div>

          <div className="form-group">
            <label className="form-label">TRANSMISSION //</label>
            <textarea
              className={`form-textarea ${horrorLevel >= 5 ? 'corrupted-input' : ''}`}
              rows={5}
              placeholder={placeholderMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={handleFieldFocus}
            />
          </div>

          <button
            className={`form-submit ${horrorLevel >= 4 ? 'submit-danger' : ''} ${submitting ? 'submitting' : ''}`}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? '// CONNECTING...'
              : horrorLevel >= 5
              ? '▓▒ SEND_ANYWAY ▒▓'
              : '// TRANSMIT_MESSAGE'}
          </button>
        </div>

        {/* Sidebar info */}
        <div className="contact-info">
          <div className="contact-info-block">
            <div className="info-label">DIRECT_SIGNAL</div>
            {/* ── ANOMALY 1: Wrong email — "gmai1" instead of "gmail" ── */}
            <a
              href={`mailto:${REAL_EMAIL}`}
              className={`info-value contact-email-anomaly
                ${!foundAnomalies.has('contact_wrong_email') ? 'anomaly-email-hint' : 'anomaly-found-text'}
              `}
              onClick={(e) => {
                e.preventDefault();
                escalate('email');
                discoverAnomaly('contact_wrong_email');
              }}
              title={!foundAnomalies.has('contact_wrong_email')
                ? 'Read this address carefully...'
                : `// ANOMALY FOUND — real address: ${REAL_EMAIL}`}
            >
              [{foundAnomalies.has('contact_wrong_email') ? REAL_EMAIL : ANOMALY_EMAIL}]
            </a>
          </div>

          <div className="contact-info-block">
            <div className="info-label">LOCATION_DATA</div>
            <div className="info-value">
              {horrorLevel >= 5 ? 'LOCATION_COMPROMISED' : 'MUMBAI, INDIA'}
            </div>
          </div>

          <div className="contact-info-block">
            <div className="info-label">AVAILABILITY</div>
            <div className="info-value info-available">
              {horrorLevel >= 5 ? '▓▓▓▓▓▓▓▓▓▓' : '● OPEN TO OPPORTUNITIES'}
            </div>
          </div>

          {/* ── ANOMALY 2: Lore block — always present, nearly invisible at horror 0 ──
              At horror 0 the text color is #111 — barely distinguishable from #000 bg.
              The div itself can still be clicked. At horror 4+ it becomes visible.      */}
          <div
            className={`contact-lore contact-lore-anomaly
              ${!foundAnomalies.has('contact_hidden_message') ? 'anomaly-lore-hint' : 'anomaly-lore-found'}
            `}
            style={{ borderLeftColor: loreDangerColor, cursor: 'pointer' }}
            onClick={() => discoverAnomaly('contact_hidden_message')}
            title={!foundAnomalies.has('contact_hidden_message')
              ? 'Something is here... in the dark'
              : undefined}
          >
            <div className="lore-line" style={{ color: loreBaseColor }}>{"// LOG_ENTRY_4719"}</div>
            <div className="lore-line" style={{ color: loreBaseColor }}>{"// SUBJECT ACCESSED CONTACT FORM"}</div>
            <div className="lore-line" style={{ color: loreBaseColor }}>{"// COORDINATES REGISTERED"}</div>
            {horrorLevel >= 6 && (
              <>
                <div className="lore-line lore-danger">{"// IT HAS YOUR ADDRESS"}</div>
                <div className="lore-line lore-danger">{"// TURN BACK"}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
