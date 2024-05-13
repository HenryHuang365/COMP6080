import React from 'react';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';

const Dashboard = (props) => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "grey",
    height:"200px",
    border:"1px solid #ccc",
    color:"#ccc",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center'
  }));
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={6} md={6}>
          <Item>Game remaining: {props.remainGames}</Item>
        </Grid>
        <Grid item xs={6} md={6}>
          <Item>Won games: {props.wonTimes}</Item>
        </Grid>
        <Grid item xs={6} md={6}>
        <Item><Button variant="contained">Keep going</Button></Item>
        </Grid>
        <Grid item xs={6} md={6}>
          <Item><Button variant="contained" onClick={props.setRemainGames(5) && props.setWonGames(0)}>Reset</Button></Item>
        </Grid>
      </Grid>
    </Box>

//     <>
//       <Stack
//         direction="column"
//         spacing={100}
//         sx={{
//           display: 'flex'
//           // Additional styles if needed
//         }}
//       >
//       <Typography variant="h3" gutterBottom>
//         Please choose an option from the navbar. 🌴
//       </Typography>
//       Games won: 0;
//       {/* {gamesWon};  */}
//       <Divider variant="middle" />
// </Stack>
//     </>
  )
}

export default Dashboard;
