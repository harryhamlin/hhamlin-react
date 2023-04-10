import React from 'react';
import 'bulma/css/bulma.min.css';

const styles = {
    title: {
        position: 'relative',
        bottom: '8vh',

    },
    border: {
        border: '2px solid #5A5A5A',
    },
}

export default function Card(props) {
    return (
        <div className="m-4">
            <a href={props.href}>
                <img style={styles.border} className="image" src={props.image} alt={props.imageAlt} />
                <div style={styles.title} className="is-flex is-flex-direction-column">
                    <span className="has-text-white has-background-grey-light">{props.title}</span>
                    <a className="has-text-white has-background-grey-light" href={props.repo}>GitHub Repo</a>
                </div>
            </a>
        </div>
    )
}