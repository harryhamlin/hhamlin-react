import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import Nav from './components/Nav';
import Header from './components/Header';
import About from './components/About';
import Body from './components/Body';
import Contact from './components/Contact';
import Footer from './components/Footer';




export default function App() {
  const [currentPage, setCurrentPage] = useState('about')

  const renderPage = () => {
    if (currentPage === 'about') {
      return <About />;
    }
    if (currentPage === 'portfolio') {
      return <Body />;
    }
    if (currentPage === 'contact') {
      return <Contact />;
    }
  }

  const pageChangeHandler = (page) => setCurrentPage(page)

    return (
      <div>

              <Nav currentPage={currentPage} pageChangeHandler={pageChangeHandler} />
              <Header/>
              {renderPage()}
              <Footer />

      </div>
    );
  }
  
  