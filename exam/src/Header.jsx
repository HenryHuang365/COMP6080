import * as React from 'react';
import logo from './logo192.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import BottomNavigation from '@mui/material/BottomNavigation';
// import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import RestoreIcon from '@mui/icons-material/Restore';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
const Header = (props) => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = React.useState('Dashboard');
  const [mathGame, setMathGame] = React.useState('Math');
  const [connect, setConnect] = React.useState('Connect4');
  const [memory, setMomory] = React.useState('Memorisation');
  console.log(window.innerWidth);
  if (window.innerWidth <= 1400) {
    setDashboard('Da'); 
    setMathGame('Ma');
    setConnect('Co');
    setMomory('Me');
  }
  return (
    <Box sx={{ 
        flexGrow: 1,
    }}>
      <AppBar 
        position="fixed"
        sx={{
          margin:"0px",
          display:"flex",
          justifyContent:"center",
          flexDirection:"row",
          alignContent:"space-between",
          background: "#333",
          color: "#fff",
          border:"1px solid #fff",
          width:"100%",
          height: window.innerWidth <= 1400 ? (window.innerWidth <= 800 ? "60px" :"80px") : "100px", 
          paddingLeft:"10%", 
          paddingRight:"10%"
        }}
      >
        <Box sx={{display:"flex", justifyContent:"center", flexDirection:"row"}}><img src={logo} alt="logo"/></Box>
        <Box sx={{display:"flex", justifyContent:"center", flexDirection:"row"}}><Button name="dashboard" color="inherit" onClick={() => { navigate('dashboard') }} sx={{ textTransform: 'none' }}>{dashboard}</Button></Box>
        <Box sx={{display:"flex", justifyContent:"center", flexDirection:"row"}}><Button name="game1" color="inherit" onClick={() => { navigate('/game/math') }} sx={{ textTransform: 'none' }}>{mathGame}</Button></Box>
        <Box sx={{display:"flex", justifyContent:"center", flexDirection:"row"}}><Button name="game2" color="inherit" onClick={() => { navigate('/game/connect') }} sx={{ textTransform: 'none' }}>{connect} 4</Button></Box>
        <Box sx={{display:"flex", justifyContent:"center", flexDirection:"row"}}><Button name="game3" color="inherit" onClick={() => { navigate('/game/memory') }} sx={{ textTransform: 'none' }}>{memory}</Button></Box>
      </AppBar>
    </Box>
    // <Box sx={{ width:"100%", height:"100px", margin:'0px'}}>
    //   <BottomNavigation 
    //     sx={{
    //       background: "#333",
    //       color: "#fff",
    //       border:"1px solid #fff"
    //     }}
    //   >
    //     <Button name="dashboard" color="inherit" onClick={() => { navigate('dashboard') }} sx={{ textTransform: 'none' }}>Home</Button>
    //     <Button name="game1" color="inherit" onClick={() => { navigate('dashboard') }} sx={{ textTransform: 'none' }}>Game 1</Button>
    //     <Button name="game2" color="inherit" onClick={() => { navigate('dashboard') }} sx={{ textTransform: 'none' }}>Game 2</Button>
    //     <Button name="game3" color="inherit" onClick={() => { navigate('dashboard') }} sx={{ textTransform: 'none' }}>Game 3</Button>
    //   </BottomNavigation>
    // </Box>
  );
}

export default Header;
