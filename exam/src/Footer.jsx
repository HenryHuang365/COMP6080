import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
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
            Jing Huang©
          </Typography>
          </Toolbar>
      </AppBar>
      </Box>
  );
}

export default Footer;
