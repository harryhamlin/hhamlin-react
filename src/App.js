import React//, { useState, useEffect } 
from 'react';
import 'bulma/css/bulma.min.css';
import Nav from './components/Nav';
import Header from './components/Header';
import About from './components/About';
import Body from './components/Body';
import Contact from './components/Contact';
import Footer from './components/Footer';


export default function App() {
    // We declare a state variable that is an array called `issues` and a function to update it.
    return (
      <div>
        {/* Here we pass our getRepoIssues function as a prop to SearchBar */}
        <div className="ui grid">
          <div className="ui row">
            <div className="eleven wide column">
              <Nav/>
              <Header/>
              <About />
              <Body />
              <Contact />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  