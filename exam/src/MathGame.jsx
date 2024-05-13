import * as React from 'react';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
const MathGame = (props) => {
  return (
  <>
    <Stack
      direction="column"
      spacing={100}
      sx={{
        display: 'flex',
        // Additional styles if needed
      }}
    >
      {/* <Button variant="contained" onClick={props.setRemainGames(props.remainGames - 1) && props.setWonGames(props.wonTimes)}>Win</Button> */}
      <Typography variant="h3" gutterBottom>
        Welcome to Connect4 game!
      </Typography>
      Games won: 0;
      {/* {gamesWon};  */}
      <Divider variant="middle" />
    </Stack>
  </>
  );
}

export default MathGame;
