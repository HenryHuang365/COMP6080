import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Import your custom theme
import PageLists from './components/PageLists';

const App = () => {
  return (
    <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
      <BrowserRouter>
        <PageLists/>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
