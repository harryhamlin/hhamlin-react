import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import { FaGithub } from 'react-icons/fa';

import { IconContext } from "react-icons";

const styles = {
    title: {
        position: 'relative',
        bottom: '8vh',
    },
    border: {
        border: '2px solid #5A5A5A',
        width: '70vh',
        height: '30vh',
        opacity: '.75',
        // backgroundImage: `url(${props.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
    },
}


export default function Card(props) {
    const [appear, setAppear] = useState({ visibility: 'hidden' });
    const [opaque, setOpacity] = useState({ opacity: "1" })
    return (
        <div className="m-4" style={opaque} onMouseEnter={e => {
            setAppear({ visibility: "visible" });
            setOpacity({ opacity: ".5" });
        }}
            onMouseLeave={e => {
                setAppear({ visibility: "hidden" })
                setOpacity({ opacity: "1" })
            }}>
            <div className="is-flex is-justify-content-space-evenly is-align-items-center" style={{ backgroundImage: `url(${props.image})`, width: "70vh", height: "30vh", backgroundSize: "cover" }}>
                <a className="button is-white" style={appear} href={props.href}>{props.title}</a>
                <a href={props.repo} style={appear}>
                    <IconContext.Provider value={{ color: "white", size: "3.5em", className: "global-class-name" }}>
                        <div>
                            <FaGithub />
                        </div>
                    </IconContext.Provider>
                </a>
            </div>
        </div>
    )
}