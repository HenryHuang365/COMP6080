import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { apiCallGet, apiCallPut } from './apiHelper';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/joy/Box';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import CardActions from '@mui/material/CardActions';

const Editlisting = (props) => {
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
  const [bedroom, setBedrooms] = React.useState('');
  const [amentities, setAmentities] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [propertyImages, setPropertyImages] = React.useState([]);
  const [back, setBack] = React.useState(false);
  const navigate = useNavigate();
  const id = useParams();
  React.useEffect(() => {
    if (back) {
      navigate('/hostlist');
    }
  }, [back, navigate]);

  React.useEffect(() => {
    const listingDetails = async () => {
      try {
        const listing = await apiCallGet(props.token, 'listings/', {}, id.id, true);
        console.log(listing)
        const data = listing.listing;
        setTitle(data.title);
        console.log(data.title)
        setAddressline1(data.address.addressline1);
        console.log(data.address.addressline1);
        setAddressline2(data.address.addressline2);
        console.log(data.address.addressline2)
        setCity(data.address.city);
        console.log(data.address.city)
        setCountry(data.address.country);
        console.log(data.address.country)
        setPostcode(data.address.postcode);
        console.log(data.address.postcode)
        setPrice(data.price);
        console.log(data.price)
        setThumbnail(data.thumbnail);
        console.log(data.thumbnail)
        setType(data.metadata.type);
        console.log(data.metadata.type)
        setBathrooms(data.metadata.bath);
        console.log(data.metadata.bath)
        setBeds(data.metadata.bed);
        console.log(data.metadata.bed)
        setAmentities(data.metadata.amentities);
        console.log(data.metadata.amentities);
        setPropertyImages(data.metadata.propertyImages)
        setBedrooms(data.metadata.bedroom)
      } catch (error) {
        props.setmodalTitle('An error has occured');
        props.setmodalContent(error);
        props.setOpen(true);
      }
    };
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      listingDetails();
    }
  }, []);

  const editListing = async () => {
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
      amentities,
      propertyImages
    }
    const reqBody = {
      title,
      address,
      thumbnail,
      price,
      metadata
    }
    try {
      const data = await apiCallPut(props.token, 'listings/' + id.id, reqBody, '', true);
      props.setmodalTitle('Success');
      props.setmodalContent(`successfully save the detail of property ${title}`);
      props.setOpen(true);
      console.log(data);
      navigate('/hostlist')
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
  // Image list used: https://mui.com/material-ui/react-image-list/
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
          <Grid item xs={12} sm={10} md={8} lg={7.2}>
            <Card sx={{
              width: {
                xs: '90%',
              },
              display: 'flex',
              flexDirection: 'column'
            }}
            direction="row"
            spacing={2}
            >
              <CardContent >
                <Typography variant="h4" gutterBottom textAlign="center">
                  Edit
                </Typography>
                <div>
                  <Typography variant="h6" gutterBottom>
                    Title
                  </Typography>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel>Title</InputLabel>
                    <OutlinedInput
                      id={`editTitle${title}`}
                      label="title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </FormControl>
                </div>
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
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel>Address line 1</InputLabel>
                      <OutlinedInput
                        id="addressline1"
                        label="addressline1"
                        value={addressline1}
                        onChange={e => setAddressline1(e.target.value)}
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel>Address line 2</InputLabel>
                      <OutlinedInput
                        id="addressline2"
                        label="addressline2"
                        value={addressline2}
                        onChange={e => setAddressline2(e.target.value)}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1 },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>City</InputLabel>
                      <OutlinedInput
                        id="city"
                        label="city"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </FormControl>

                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Coutry</InputLabel>
                      <OutlinedInput
                        id="country"
                        label="country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                      />
                    </FormControl>

                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Postcode</InputLabel>
                      <OutlinedInput
                        id="postcode"
                        label="postcode"
                        value={postcode}
                        onChange={e => setPostcode(e.target.value)}
                      />
                    </FormControl>
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
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Price</InputLabel>
                      <OutlinedInput
                        id="price"
                        label="price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Type</InputLabel>
                      <OutlinedInput
                        id="type"
                        label="type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Bathrooms</InputLabel>
                      <OutlinedInput
                        id="bath"
                        label="Bathrooms"
                        value={bath}
                        onChange={e => setBathrooms(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Bed</InputLabel>
                      <OutlinedInput
                        id="bed"
                        label="bed"
                        value={bed}
                        onChange={e => setBeds(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Number of Bedrooms</InputLabel>
                      <OutlinedInput
                        id="bedrooms"
                        label="Number of Bedrooms"
                        value={bedroom}
                        onChange={e => setBedrooms(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Amentities</InputLabel>
                      <OutlinedInput
                        id="amentities"
                        label="amentities"
                        value={amentities}
                        onChange={e => setAmentities(e.target.value)}
                      />
                    </FormControl>
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
                    <VisuallyHiddenInput id={`${title}editthumbnail`} type="file" onChange={handleThumbnailUpload} data-cy={`${title}editThumbnailCreate`} />
                  </Button>
                </Stack>
                <br/>
                <Stack>
                  <Typography variant="h6" gutterBottom>
                    Property Images
                  </Typography>
                  {/* imagelist is copied from Mui:  https://mui.com/material-ui/react-image-list/ */}
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
                    <VisuallyHiddenInput type="file" multiple onChange={handlePropertyImagesUpload} />
                  </Button>
                </Stack>
              </CardContent>
              <CardActions>
                <Button variant="contained" onClick={() => setBack(true)}>Back</Button>
                <Button id={`editsubmit${title}`} variant="contained" onClick={ editListing }>Submit</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </>
  )
}

export default Editlisting;
