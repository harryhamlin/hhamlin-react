import React//, { useState, useEffect } 
    from 'react';
import 'bulma/css/bulma.min.css';
import Card from './Card';
import photo from '../images/cherryblossoms.jpg';

const styles = {
    border: {
        borderRight: '2px solid #5A5A5A'
    }
}

export default function Body() {
    return (
        <div className="columns px-5" id="portfolio">
            <div className="column is-one-fifth is-flex is-justify-content-flex-end" >
                <div><span style={styles.border} className="is-size-3 pr-2">Portfolio</span></div>
            </div>
            <div className="column">
                <div className="columns is-multiline is-flex is-justify-content-center">
                    <Card  href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 1" repo="https://www.facebook.com" />

                    <Card  href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 2" repo="https://www.facebook.com" />

                    <Card  href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 3" repo="https://www.facebook.com" />
                    <Card  href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 4" repo="https://www.facebook.com" />

                    <Card  href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 5" repo="https://www.facebook.com" />
                    <Card  href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 6" repo="https://www.facebook.com" />
                </div>
            </div>
        </div>
    )
}