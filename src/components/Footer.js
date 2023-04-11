import React from 'react';
import 'bulma/css/bulma.min.css';

const styles = {
    footer: {
        minHeight: "20vh"
    }
}

export default function Footer() {
    return (
        <footer className="footer">
            <div className="is-flex is-justify-content-space-around" style={styles.footer}>
                <a href="https://www.github.com/harryhamlin">GitHub</a>
                <a href="https://www.linkedin.com/in/harry-hamlin-a4a1b0234/">LinkedIn</a>
                <a href="https://www.npmjs.com/~harryhamlin">NPM</a>
            </div>
        </footer>
    )
}