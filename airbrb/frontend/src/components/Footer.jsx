import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
          <Toolbar>
          <Typography
              variant="h7"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { sm: 'block' } }}
          >
            Airbrb©
          </Typography>
          </Toolbar>
      </AppBar>
      </Box>
  );
}

export default Footer;
