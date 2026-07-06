import React from 'react';

export default function Card({ title, tags, description, href, repo, image, imageAlt }) {
  return (
    <div className="portfolio-card">
      {image && (
        <img
          className="portfolio-card-image"
          src={image}
          alt={imageAlt || title}
        />
      )}
      <div className="portfolio-card-body">
        <h3>{title}</h3>
        {tags && <p className="card-tags">{tags}</p>}
        {description && <p>{description}</p>}
        <div className="portfolio-card-links">
          {href && <a href={href} target="_blank" rel="noreferrer">Live ↗</a>}
          {repo && <a href={repo} target="_blank" rel="noreferrer">GitHub ↗</a>}
        </div>
      </div>
    </div>
  );
}
