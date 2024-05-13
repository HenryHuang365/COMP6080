import React from 'react';
import Dashboard from './Dashboard';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import Stack from '@mui/material/Stack';
import MathGame from './MathGame';
import ErrorModal from './BasicModal';
import Connect from './Connect4';
import Memorisation from './Memorisation';
// code is copied from Hadyden week 8 lecture demo code.

const PageLists = () => {
  const [remainGames, setRemainGames] = React.useState(5);
  const [wonTimes, setWonTimes] = React.useState(0);
  const [errorOpen, setOpen] = React.useState(false);
  const [modalTitle, setmodalTitle] = React.useState('Modal title');
  const [modalContent, setmodalContent] = React.useState('Modal content');
  const stackSpacing = 12;
  return (
    <>
      <Stack spacing={stackSpacing} sx={{margin: "0px", background:"#ccc"}}> 
        <Header setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>       
        <br/>
        <Routes>
            <Route path='/' element={<Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={<Dashboard remainGames = {remainGames} setRemainGames = {setRemainGames} wonTimes = {wonTimes} setWonTimes = {setWonTimes} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>} />
            <Route path='game/math' element={<MathGame remainGames = {remainGames} setRemainGames = {setRemainGames} wonTimes = {wonTimes} setWonTimes = {setWonTimes} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>} />
            <Route path='game/connect' element={<Connect remainGames = {remainGames} setRemainGames = {setRemainGames} wonTimes = {wonTimes} setWonTimes = {setWonTimes} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>} />
            <Route path='game/memory' element={<Memorisation remainGames = {remainGames} setRemainGames = {setRemainGames} wonTimes = {wonTimes} setWonTimes = {setWonTimes} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>} />
        </Routes>
        <ErrorModal errorOpen = {errorOpen} modalTitle = {modalTitle} modalContent = {modalContent} setOpen = {setOpen}/>
      </Stack>
    </>
  );
}

export default PageLists;
