import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { apiCallPost } from './apiHelper';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/joy/Box';

const CreateListing = (props) => {
  const [title, setTitle] = React.useState('');
  const [addressline1, setAddressline1] = React.useState('');
  const [addressline2, setAddressline2] = React.useState('');
  const [city, setCity] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [type, setType] = React.useState('');
  const [bath, setBathrooms] = React.useState('');
  const [bed, setBeds] = React.useState('');
  const [bedroom, setBedroom] = React.useState('');
  const [amentities, setAmentities] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [propertyImages, setPropertyImages] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);
  const createListing = async () => {
    const address = {
      addressline1,
      addressline2,
      city,
      country,
      postcode
    }
    const metadata = {
      type,
      bath,
      bed,
      bedroom,
      amentities,
      propertyImages
    }
    const reqBody = {
      title,
      address,
      price,
      thumbnail,
      metadata
    }
    try {
      const data = await apiCallPost(props.token, 'listings/new', reqBody, '', true)
      // this listingId needs to give to the listing card.
      localStorage.setItem('listingId', data.listingId);
      props.setmodalTitle('Success');
      props.setmodalContent('successfully create a property!');
      props.setOpen(true);
      navigate('/hostlist');
    } catch (error) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
  }

  const fileToDataUrl = (file) => {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent('provided file is not a png, jpg or jpeg image.');
      props.setOpen(true);
    }
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
  }

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await fileToDataUrl(file);
        setThumbnail(imageUrl);
      } catch (error) {
        props.setmodalTitle('An error has occured');
        props.setmodalContent(error);
        props.setOpen(true);
      }
    }
  };

  const handlePropertyImagesUpload = async (event) => {
    const files = Array.from(event.target.files);
    try {
      const imageUrls = await Promise.all(files.map(file => fileToDataUrl(file)));
      setPropertyImages(prevImages => [...prevImages, ...imageUrls]);
    } catch (error) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
  };

  const deletePropertyImage = (index) => {
    setPropertyImages(propertyImages.filter((_, i) => i !== index));
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
      <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6.55}>
          <Card sx={{
            width: {
              xs: '90%',
            },
            display: 'flex',
            flexDirection: 'column',
          }}
          direction="row"
          spacing={2}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom textAlign="center">
                Create a property 🔨
              </Typography>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '97%' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <Typography variant="h6" gutterBottom>
                      Title
                  </Typography>
                  <TextField
                    name="createTitleInput"
                    required
                    id="title-required"
                    label="Title"
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
              </Box>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '80ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <TextField
                    name="createAddressInput1"
                    required
                    id="addressline1-required"
                    label="Address line 1"
                    onChange={e => setAddressline1(e.target.value)}
                  />
                  <TextField
                    name="createAddressInput2"
                    id="-optional"
                    label="Address line 2"
                    onChange={e => setAddressline2(e.target.value)}
                  />
                </div>
              </Box>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    required
                    name="createCityInput"
                    id="city-required"
                    label="City"
                    onChange={e => setCity(e.target.value)}
                  />

                  <TextField
                    required
                    name="createCountryInput"
                    id="country-required"
                    label="Country"
                    onChange={e => setCountry(e.target.value)}
                  />

                  <TextField
                    required
                    name="createPostCodeInput"
                    id="postcode-required"
                    label="Postcode"
                    onChange={e => setPostcode(e.target.value)}
                  />
                </div>
              </Box>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <Typography variant="h6" gutterBottom>
                    Property Details
                  </Typography>
                  <TextField
                    required
                    name="createPriceInput"
                    id="price-required"
                    label="Price (per night)"
                    onChange={e => setPrice(e.target.value)}
                  />
                  <TextField
                    required
                    name="createTypeInput"
                    id="type-required"
                    label="Type"
                    onChange={e => setType(e.target.value)}
                  />
                  <TextField
                    id="bathrooms-number"
                    name="createNbathInput"
                    label="Number of bathrooms"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e => setBathrooms(e.target.value)}
                  />
                  <TextField
                    id="beds-number"
                    name="createNbedInput"
                    label="Number of beds"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e => setBeds(e.target.value)}
                  />
                  <TextField
                    id="beds-room-number"
                    name="createNbedInput1"
                    label="Number of bedrooms"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e => setBedroom(e.target.value)}
                  />
                  <TextField
                    id="amentities-number"
                    name="createNamennput"
                    label="Property amentities"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e => setAmentities(e.target.value)}
                  />
                </div>
              </Box>
              <Stack>
                <Typography variant="h6" gutterBottom>
                  Thumbnail
                </Typography>
                {thumbnail && (
                  <ImageList sx={{ width: '100%', height: 250 }} cols={1} rowHeight={164}>
                    <ImageListItem>
                      <img src={thumbnail} alt="Thumbnail" loading="lazy" />
                      <Button
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0
                        }}
                        onClick={() => setThumbnail('')}
                      >
                        🗑️
                      </Button>
                    </ImageListItem>
                  </ImageList>
                )}
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Upload Thumbnail
                  <VisuallyHiddenInput type="file" onChange={handleThumbnailUpload} data-cy="uploadThumbnailCreate"/>
                </Button>
              </Stack>
              <br/>
              <Stack>
                <Typography variant="h6" gutterBottom>
                  Property Images
                </Typography>
                <ImageList sx={{ width: '100%', height: 250 }} cols={window.innerWidth <= 375 ? 1 : 2} rowHeight={164}>
                  {propertyImages.map((img, index) => (
                    <ImageListItem key={index} sx={{
                      '&:hover button': { display: 'block' },
                      marginBottom: 9
                    }}>
                    <img src={img} alt={`Property Image ${index}`} loading="lazy" />
                    <Button
                      sx={{
                        display: 'none',
                        position: 'absolute',
                        top: 0,
                        right: 0
                      }}
                      onClick={() => deletePropertyImage(index)}
                    >
                      🗑️
                    </Button>
                  </ImageListItem>
                  ))}
                </ImageList>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Upload Property Images
                  <VisuallyHiddenInput type="file" multiple onChange={handlePropertyImagesUpload} data-cy="uploadPropertyImageCreate" />
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <br/>
          <Box sx={{
            width: {
              xs: '90%'
            },
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Button variant="contained" onClick={() => { navigate('/hostlist') }}>Back</Button>
            <Button name="submitCreate" variant="contained" onClick={ createListing }>Submit</Button>
          </Box>
        </Grid>
    </Grid>
      </>
  )
}
export default CreateListing;
