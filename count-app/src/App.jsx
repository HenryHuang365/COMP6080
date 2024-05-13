import logo from './logo.svg';
import './App.css';
import React, {useState, useCallback} from 'react';

function App() {
  const [count, setCount] = useState(0);

  // Memoized increment function
  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>You have clicked {count} times</p>
        <button onClick={increment}>
          Pick me!
        </button>
      </header>
    </div>
  );
}

export default App;
