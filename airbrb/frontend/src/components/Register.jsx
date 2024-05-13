import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { apiCallPost } from './apiHelper';
// code is copied from Hadyden week 8 lecture demo code.

const Register = (props) => {
  console.log(props);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmpwd, setConfirmpwd] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.token) {
      navigate('/dashboard');
    }
  }, [props.token]);
  const register = async () => {
    console.log(email, password, name, confirmpwd);
    if (password !== confirmpwd) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent('password does not match');
      props.setOpen(true);
      return;
    }
    // const response = await fetch('http://localhost:5500/user/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     email,
    //     password,
    //     name
    //   }),
    //   headers: {
    //     'Content-type': 'application/json',
    //   }
    // });
    const reqBody = {
      email,
      password,
      name
    }
    try {
      const data = await apiCallPost(props.token, 'user/auth/register', reqBody, '', false)
      console.log(data)
      localStorage.setItem('token', data.token);
      localStorage.setItem('curremail', email);
      props.setToken(data.token);
      navigate('/dashboard');
    } catch (error) {
      // document.getElementById()
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
    // if (data.error) {
    //   alert(data.error)
    // } else if (data.token) {
    //   localStorage.setItem('token', data.token);
    //   props.setToken(data.token);
    //   navigate('/dashboard');
    // }
  }
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>

      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="center"
      >
        <Card sx={{
          minWidth: 275,
          display: 'flex',
          flexDirection: 'column',
          flex: 0.2,
        }}
          direction="row"
          spacing={2}
        >
          <CardContent >

          <Stack justifyContent="center" direction="column">
              <Typography variant="h4" gutterBottom textAlign="center">
                Register
              </Typography>
              <TextField
                id="outlined-multiline-flexible"
                label="Email"
                name="EmailInput"
                multiline
                maxRows={4}
                sx={{ m: 1 }}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="User name"
                name="UserNameInput"
                multiline
                maxRows={4}
                sx={{ m: 1 }}
                onChange={e => setName(e.target.value)}
              />
              {/* <input type='text' value={email} onChange={e => setEmail(e.target.value)}/><br/> */}
              <br/>
              <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="PasswordInput"
                  type={showPassword ? 'text' : 'password'}
                  onChange={e => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Confirmed Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="PasswordInputTwice"
                  type={showPassword ? 'text' : 'password'}
                  onChange={e => setConfirmpwd(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirmed Password"
                />
              </FormControl>

              <br/>
              {/* <input type='Password' value={password} onChange={e => setPassword(e.target.value)}/><br/> */}
              <Button name="registerButton" variant="contained" onClick={register}>Register</Button>
            </Stack>
          </CardContent>
          <CardActions>
            <Button onClick={() => { navigate('/login') }} size="small" sx={ { textTransform: 'none' } }>Already have an account? Login</Button>
          </CardActions>
      </Card>
      </Stack>
    </>
  )
}

export default Register;
