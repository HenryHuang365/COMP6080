import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { apiCallPost } from './apiHelper';
const Header = (props) => {
  console.log('header')
  console.log(props)
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const data = await apiCallPost(props.token, 'user/auth/logout', {}, '', true)
      console.log(data)
      props.setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('curremail');
      localStorage.removeItem('listingId');
      localStorage.removeItem('dateRangeSearch')
      navigate('/');
    } catch (error) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { sm: 'block' } }}
          >
            AirBrB
          </Typography>
          { localStorage.getItem('token')
            ? (
          <>
            <Button name="switchHostList" color="inherit" onClick={() => { navigate('hostlist') }} sx={{ textTransform: 'none' }}>Switch to hosted listings</Button>
            <Button name="switchAllList" color="inherit" onClick={() => { navigate('dashboard') }} sx={{ textTransform: 'none' }}>Switch to all listings</Button>
            <Button name="logoutbtn" color="inherit" onClick={logout}>Logout</Button>
          </>
              )
            : (
          <><Button name="headerLogin" color="inherit" onClick={() => { navigate('login') } }>Login</Button></>
              )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
