import * as React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
const Connect = (props) => {
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

export default Connect;
