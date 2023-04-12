import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import { FaGithub } from 'react-icons/fa';
import { IconContext } from "react-icons";

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
            <div className="is-flex is-justify-content-space-evenly is-align-items-center box" style={{ backgroundImage: `url(${props.image})`, width:"35vh", height: "20vh", backgroundSize: "cover" }}>
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