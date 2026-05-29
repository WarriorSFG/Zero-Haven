import React, { useState, useEffect } from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

// As the user types, corrupt their input slightly at high horror levels
const corruptText = (text, horrorLevel) => {
  if (horrorLevel < 5) return text;
  const corruption = '▓▒░█▄▀■□▪▫';
  return text.split('').map((char, i) => {
    if (Math.random() < (horrorLevel - 4) * 0.04 && char !== ' ') {
      return corruption[Math.floor(Math.random() * corruption.length)];
    }
    return char;
  }).join('');
};

const ContactSection = () => {
  const { horrorLevel, escalate, executeJumpscare } = useHorror();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placeholderName, setPlaceholderName]       = useState('YOUR_NAME');
  const [placeholderEmail, setPlaceholderEmail]     = useState('YOUR_EMAIL');
  const [placeholderMessage, setPlaceholderMessage] = useState('[INSERT YOUR MESSAGE HERE]');

  // Corrupt placeholders at high horror level
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

    // The "submit" is the final escalation — triggers jumpscare
    setTimeout(() => {
      executeJumpscare();
    }, 1200);
  };

  const handleFieldFocus = () => escalate('focus');

  return (
    <section className="section contact-section">
      <div className="section-header">
        <span className="section-tag">// OPEN_CHANNEL</span>
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
            <a href="mailto:[YOUR_EMAIL]" className="info-value" onClick={() => escalate('email')}>
              [YOUR_EMAIL@DOMAIN.COM]
            </a>
          </div>
          <div className="contact-info-block">
            <div className="info-label">LOCATION_DATA</div>
            <div className="info-value">
              {horrorLevel >= 5 ? 'LOCATION_COMPROMISED' : '[YOUR_CITY, COUNTRY]'}
            </div>
          </div>
          <div className="contact-info-block">
            <div className="info-label">AVAILABILITY</div>
            <div className="info-value info-available">
              {horrorLevel >= 5 ? '▓▓▓▓▓▓▓▓▓▓' : '● OPEN TO OPPORTUNITIES'}
            </div>
          </div>

          {horrorLevel >= 4 && (
            <div className="contact-lore">
              <div className="lore-line">// LOG_ENTRY_4719</div>
              <div className="lore-line">// SUBJECT ACCESSED CONTACT FORM</div>
              <div className="lore-line">// COORDINATES REGISTERED</div>
              {horrorLevel >= 6 && (
                <>
                  <div className="lore-line lore-danger">// IT HAS YOUR ADDRESS</div>
                  <div className="lore-line lore-danger">// TURN BACK</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
