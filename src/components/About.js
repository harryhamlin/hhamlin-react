import React//, { useState, useEffect } 
    from 'react';
import 'bulma/css/bulma.min.css';

const styles = {
    border: {
        borderRight: '2px solid #5A5A5A'
    }
}

export default function About() {
    return (
        <div id="aboutme" className="columns px-5">
            <div className="column is-one-fifth is-flex is-justify-content-flex-end" >
                <div><span style={styles.border} className="is-size-3 pr-2">About Me</span></div>
            </div>
            <div className="column is-flex is-flex-direction-column has-text-justified">
                <div>
                    My name is Harry Hamlin and I'm a business leader in the Pacific Northwest. My professional passions
                    include a desire to foster growth and mentorship, specifically through the systematic implementation and
                    execution of efficient systemization. My work styles are big-picture oriented, I'm confident and
                    collaborative, and adaptable to many workplace environments. I strive to provide value to the teams I am
                    a part of and through collaboration, foster growth and forward progress. My inspirations come from
                    successes from my work colleagues, my friends and my family. My interests include mountain biking,
                    traveling, and cooking.
                </div><div className="spacer"></div><div>
                    I've spent the past 10 years working professionally in the outdoor industry. The first several years of
                    my professional life were spent working as a shift supervisor on ski patrol at Crystal Mountain in
                    Washington and a professional climbing guide internationally. Through my work, I was able to reach the
                    summit of Everest, Lhotse, and Mt Rainier over 50 times. For the past 2 years I have worked as the
                    director of operations at International Mountain Guides, managing the company's staff of over 50 guides
                    and operations of all domestic and international expeditions. Throughout my experiences I've developed
                    excellent leadership and problem solving skills as well as a desire to foster growth and mentorship.
                    I've had the opportunity to execute many technical projects, including the creation and systematic
                    implementation of a custom built registration system and a collaborative ATF compliant data collection
                    system.
                </div>
            </div>
        </div>
    )
}