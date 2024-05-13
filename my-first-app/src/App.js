import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = () => {
  return <div><Nav />Home</div>
}; 

const About = () => {
  return <div><Nav />About</div>
}; 

const Profile = () => {
  return <div><Nav />Profile</div>
}; 

const Nav = () => {
  return <div>Nav</div>
}

function App() {
  return (
    <>
    {/* <div>Dav</div> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
      
  );
}

export default App;
