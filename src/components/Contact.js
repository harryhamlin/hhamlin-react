import React, { useState } from 'react';
import validator from 'validator';

export default function Contact() {
  const [clientName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'clientName') setName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'message') setMessage(value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    if (!validator.isEmail(email)) { setEmailError('Please enter a valid email address.'); valid = false; }
    if (!message) { setMessageError('Message cannot be blank.'); valid = false; }
    if (!valid) return;
    console.log(`${clientName} ${email} ${message}`);
    setName(''); setEmail(''); setMessage('');
    setEmailError(''); setMessageError('');
  };

  return (
    <main className="page-main" id="contact">
      <section className="page-section reveal">
        <p className="section-label">Send a Message</p>
        <form className="contact-form" onSubmit={handleFormSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="clientName">Name</label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              value={clientName}
              onChange={handleInputChange}
              placeholder="Your name"
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              onBlur={() => {
                if (email && !validator.isEmail(email)) setEmailError('Please enter a valid email address.');
                else setEmailError('');
              }}
            />
            {emailError && <p className="form-error">{emailError}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
              onBlur={() => {
                if (!message) setMessageError('Message cannot be blank.');
                else setMessageError('');
              }}
            />
            {messageError && <p className="form-error">{messageError}</p>}
          </div>
          <button className="form-submit" type="submit">Send Message</button>
        </form>
      </section>
    </main>
  );
}
