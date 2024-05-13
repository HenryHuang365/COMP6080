import React from 'react';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Stack from '@mui/material/Stack';
import ErrorModal from './BasicModal';
import HostList from './HostList';
import CreateListing from './CreateListing';
import Editlisting from './Editlisting';
import SelectedList from './SelectedList';
// code is copied from Hadyden week 8 lecture demo code.

const PageLists = () => {
  // const [page, setPage] = React.useState('');
  const [token, setToken] = React.useState(null);
  // const navigate = useNavigate();

  React.useEffect(() => {
    const currToken = localStorage.getItem('token');
    if (currToken) {
      setToken(currToken);
    }
  }, [])

  const [errorOpen, setOpen] = React.useState(false);
  const [modalTitle, setmodalTitle] = React.useState('Modal title');
  const [modalContent, setmodalContent] = React.useState('Modal content');
  const stackSpacing = location.pathname === '/login' ? 28 : location.pathname === '/register' ? 18 : 20;
  return (
    <>
      <Stack spacing={stackSpacing}>
          <Header token = {token} setToken = {setToken} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>
          <br/>
          <Routes>
              <Route path='/' element={<Navigate to='/dashboard' />} />
              <Route path='/hostlist' element={<HostList token = {token} setToken = {setToken} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>} />
              <Route path='/dashboard' element={<Dashboard token = {token} setToken = {setToken} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>} />
              <Route path='/register' element={<Register token = {token} setToken = {setToken} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>} />
              <Route path='/login' element={<Login token = {token} setToken = {setToken} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>}/>
              <Route path='/createlisting' element={<CreateListing token = {token} setToken = {setToken} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>}/>
              <Route path='/editlisting/:id' element={<Editlisting token = {token} setToken = {setToken} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>}/>
              <Route path='/selectlisting/:id' element={<SelectedList token = {token} setToken = {setToken} setOpen = {setOpen} setmodalTitle = {setmodalTitle} setmodalContent = {setmodalContent}/>}/>
          </Routes>
          <br/>
          <ErrorModal errorOpen = {errorOpen} modalTitle = {modalTitle} modalContent = {modalContent} setOpen = {setOpen}/>
          <Footer/>
      </Stack>
    </>
  );
}

export default PageLists;
