import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import PageLists from './PageLists';

const App = () => {
  return (
    <BrowserRouter>
      <PageLists/>
    </BrowserRouter>
  );
}

export default App;
