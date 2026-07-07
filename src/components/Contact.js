import React from 'react';

const links = [
  { label: 'Email', value: 'harryhamlin@gmail.com', href: 'mailto:harryhamlin@gmail.com' },
  { label: 'GitHub', value: '@harryhamlin', href: 'https://github.com/harryhamlin' },
  { label: 'LinkedIn', value: 'harry-hamlin', href: 'https://www.linkedin.com/in/harry-hamlin-a4a1b0234/' },
];

export default function Contact() {
  return (
    <main className="page-main" id="contact">
      <section className="page-section reveal">
        <p className="section-label">Get in Touch</p>
        <ul className="contact-links">
          {links.map(({ label, value, href }) => (
            <li key={label} className="contact-link-row">
              <span className="contact-link-label">{label}</span>
              <a className="contact-link-value" href={href}>{value}</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
