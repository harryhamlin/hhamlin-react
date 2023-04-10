import React//, { useState, useEffect } 
    from 'react';
import 'bulma/css/bulma.min.css';
import headshot from '../images/headshot.jpg';
import blossoms from '../images/cherryblossoms.jpg';

const styles = {
    buffer_image: {
        height: '30vh',
        opacity: '.75',
        backgroundImage: `url(${blossoms})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
    },
    headshot: {
        border: '2px solid #5A5A5A',
    },
    section: {
        position: 'relative',
        bottom: '8vh'
    }
}

export default function Header() {
    return (
        <div id="header">
            <div style={styles.buffer_image}>
            </div>
            <div className="is-flex is-flex-direction-row-reverse is-align-items-flex-end mr-6" style={styles.section}>
                <figure className="image is-128x128">
                    <img className="is-rounded" src={headshot} id="headshot" alt="Harry Hamlin Headshot" style={styles.headshot} />
                </figure>
            </div>
        </div>
    )
}