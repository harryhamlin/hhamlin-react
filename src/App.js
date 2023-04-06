import React//, { useState, useEffect } 
from 'react';
import 'bulma/css/bulma.min.css';

function App() {
    // We declare a state variable that is an array called `issues` and a function to update it.
  
    return (
      <div>
        {/* Here we pass our getRepoIssues function as a prop to SearchBar */}
        <div className="ui grid">
          <div className="ui row">
            <div className="eleven wide column">
              <h1 className="is-size-1">i like toitles 🐢</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default App;