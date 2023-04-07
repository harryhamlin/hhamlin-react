import React from 'react';
import 'bulma/css/bulma.min.css';

const styles = {
    title: {
        position: 'relative',
        bottom: '4vh',
        backgroundColor: '#5A5A5A',
        color: 'white'
    },
    border: {
        border: '2px solid #5A5A5A'
    }
}

export default function Card(props) {
    return (
        <div>
            <ul>
                <a href={props.href} >
                    <img style={styles.border} className="image is-128x128" src={props.image} alt={props.imageAlt} />
                    <span style={styles.title}>{props.title}</span>
                </a>
            </ul>
        </div>
    )
}