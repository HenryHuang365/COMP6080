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
const Login = (props) => {
  console.log(props);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  React.useEffect(() => {
    console.log(`if ${props.token}`)
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [props.token]);

  const login = async () => {
    const reqBody = {
      email,
      password,
    }
    try {
      const data = await apiCallPost(props.token, 'user/auth/login', reqBody, '', false)
      localStorage.setItem('token', data.token);
      localStorage.setItem('curremail', email);
      props.setToken(data.token);
      navigate('/dashboard');
    } catch (error) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
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
                Login
              </Typography>
              <TextField
                id="loginEmail"
                label="Email"
                multiline
                maxRows={4}
                sx={{ m: 1 }}
                onChange={e => setEmail(e.target.value)}
              />
              {/* <input type='text' value={email} onChange={e => setEmail(e.target.value)}/><br/> */}
              <br/>
              <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="loginPassword"
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
              <br/>
              {/* <input type='Password' value={password} onChange={e => setPassword(e.target.value)}/><br/> */}
              <Button id="loginbtn" variant="contained" onClick={login}>Login</Button>
            </Stack>
          </CardContent>
          <CardActions>
            <Button onClick={() => { navigate('/register') }} size="small" name="signUpButton">Sign up</Button>
          </CardActions>
      </Card>
      </Stack>
      </>
  )
}

export default Login;
