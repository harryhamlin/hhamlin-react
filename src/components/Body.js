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
        <div className="columns">
            <div className="column is-one-fifth is-flex is-justify-content-flex-end" >
                <div><span style={styles.border} className="is-size-3 pr-2">Portfolio</span></div>
            </div>
            <div className="column">
                <Card href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 1"/>
                <Card href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 1"/>
                <Card href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 1"/>
                <Card href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 1"/>
                <Card href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 1"/>
                <Card href="https://www.google.com" image={photo} imageAlt="cherry blossoms" title="Project 1"/>
            </div>
        </div>
    )
}