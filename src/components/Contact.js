import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

export default function Contact() {
    // Here we set two state variables for firstName and lastName using `useState`
    const [clientName, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'clientName') {
            return setName(value)
        } else if (name === 'email') {
            return setEmail(value)
        } else if (name === 'message') {
            return setMessage(value)
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(`${clientName}${email}${message}`);
        setName('');
        setEmail('');
        setMessage('');
    };


    const styles = {
        border: {
            borderRight: '2px solid #5A5A5A'
        }
    }
    
    return (
        <div className="columns">
            <div className="column is-one-fifth is-flex is-justify-content-flex-end" >
                <div><span style={styles.border} className="is-size-3 pr-2">Contact</span></div>
            </div>
            <div className="column">
                <form className="form">
                    <input
                        value={clientName}
                        name="clientName"
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Name"
                    />
                    <input
                        value={email}
                        name="email"
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Email"
                    />
                    <input
                        value={message}
                        name="message"
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Message"
                    />
                    <button type="button" onClick={handleFormSubmit}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}