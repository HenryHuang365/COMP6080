import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { apiCallGet, apiCallPost, apiCallPut } from './apiHelper';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/joy/Box';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import CardActions from '@mui/material/CardActions';
import Rating from '@mui/material/Rating';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import timezone from 'dayjs/plugin/timezone'; // Import Timezone plugin
import minMax from 'dayjs/plugin/minMax';
import { TextField } from '@mui/material';
// import Textarea from '@mui/joy/Textarea';

dayjs.extend(minMax);
// Use the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone to Sydney
dayjs.tz.setDefault('Australia/Sydney');
const SelectedList = (props) => {
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
  const [amentities, setAmentities] = React.useState('');
  const [bedroom, setBedrooms] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [propertyImages, setPropertyImages] = React.useState([]);
  const [back, setBack] = React.useState(false);
  const [rate, setRate] = React.useState(0);
  const [range, setRange] = React.useState([null, null]);
  const [value, setValue] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [reviews, setReviews] = React.useState([]);
  const [submit, setSubmit] = React.useState(false)
  const navigate = useNavigate();
  const id = useParams();
  React.useEffect(() => {
    if (back) {
      navigate('/dashboard');
    }
  }, [back, navigate]);

  React.useEffect(() => {
    const listingDetails = async () => {
      try {
        const listing = await apiCallGet(props.token, 'listings/', {}, id.id, true);
        const data = listing.listing;
        setTitle(data.title);
        setAddressline1(data.address.addressline1);
        setAddressline2(data.address.addressline2);
        setCity(data.address.city);
        setCountry(data.address.country);
        setPostcode(data.address.postcode);
        setPrice(data.price);
        setThumbnail(data.thumbnail);
        setType(data.metadata.type);
        setBathrooms(data.metadata.bath);
        setBeds(data.metadata.bed);
        setAmentities(data.metadata.amentities);
        setPropertyImages(data.metadata.propertyImages)
        setBedrooms(data.metadata.bedroom)
        const newReview = [...data.reviews];
        setReviews(newReview)

        console.log(reviews)
        let totalRating = 0;
        for (const rate of data.reviews) {
          totalRating += rate.rate;
        }
        if (data.reviews.length > 0) {
          setRate(totalRating / data.reviews.length)
        } else {
          setRate(0)
        }
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
  }, [submit]);

  const handleBook = async () => {
    if (range[0] === null || range[1] === null) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent('Please fill the date');
      props.setOpen(true);
      return;
    }
    console.log(range)
    const dateRange = { start: dayjs(range[0]).tz('Australia/Sydney').format(), end: dayjs(range[1]).tz('Australia/Sydney').format() }
    const startDate = dayjs(range[0]);
    const endDate = dayjs(range[1]);
    // calculate the difference in days
    const differenceInDays = endDate.diff(startDate, 'day');
    const totalPrice = differenceInDays * price;

    const reqBody = {
      dateRange,
      totalPrice
    }
    try {
      await apiCallPost(props.token, `bookings/new/${id.id}`, reqBody, '', true)
      props.setmodalTitle('Success');
      props.setmodalContent(`successfully make a booking to the property ${title}`);
      props.setOpen(true);
    } catch (error) {
      // document.getElementById()
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
  }

  const handleComment = async () => {
    try {
      let canComment = false;
      const bookings = await apiCallGet(props.token, 'bookings', {}, '', true);
      console.log(bookings);

      const currentUser = localStorage.getItem('curremail');
      let bookingID;
      for (const book of bookings.bookings) {
        if (book.owner === currentUser && book.status === 'accepted' && book.listingId === id.id) {
          // user has a book in the current property and it is accepted
          canComment = true;
          bookingID = book.id;
        }
      }

      if (canComment) {
        // request a comment since user can book
        if (value === null) setValue(0);
        const reqBody = {
          review: {
            rate: value,
            comment
          }
        }

        await apiCallPut(props.token, `listings/${id.id}/review/${bookingID}`, reqBody, '', true);
        setSubmit(!submit);
      } else {
        props.setmodalTitle("You're not allowed to comment");
        props.setmodalContent('you are not allowed to comment since your booking for this property is not accepted');
        props.setOpen(true);
        return;
      }
    } catch (error) {
      // document.getElementById()
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
  }
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
                  Detail of {id.id} 📚
                </Typography>
                <div>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel>Title</InputLabel>
                    <OutlinedInput
                      disabled
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
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel>Address line 1</InputLabel>
                      <OutlinedInput
                        disabled
                        id="addressline1"
                        label="addressline1"
                        value={addressline1}
                        onChange={e => setAddressline1(e.target.value)}
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel>Address line 2</InputLabel>
                      <OutlinedInput
                        disabled
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
                        disabled
                        id="city"
                        label="city"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </FormControl>

                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Coutry</InputLabel>
                      <OutlinedInput
                        disabled
                        id="country"
                        label="country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                      />
                    </FormControl>

                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Postcode</InputLabel>
                      <OutlinedInput
                        disabled
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
                    { localStorage.getItem('dateRangeSearch')
                      ? (
                    <>
                      <FormControl sx={{ m: 1 }}>
                        <InputLabel>Price per stay $</InputLabel>
                        <OutlinedInput
                          disabled
                          id="price"
                          label="Price per stay $"
                          value={price * parseInt(localStorage.getItem('dateRangeSearch'))}
                          onChange={e => setPrice(e.target.value)}
                        />
                      </FormControl>
                    </>
                        )
                      : (
                    <>
                      <FormControl sx={{ m: 1 }}>
                        <InputLabel>Price per night $</InputLabel>
                        <OutlinedInput
                          disabled
                          id="price"
                          label="Price per night $"
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                        />
                      </FormControl>
                    </>
                        )}
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Type</InputLabel>
                      <OutlinedInput
                        disabled
                        id="type"
                        label="type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Bathrooms</InputLabel>
                      <OutlinedInput
                        disabled
                        id="bath"
                        label="Bathrooms"
                        value={bath}
                        onChange={e => setBathrooms(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Bed</InputLabel>
                      <OutlinedInput
                        disabled
                        id="bed"
                        label="bed"
                        value={bed}
                        onChange={e => setBeds(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Number of Bedrooms</InputLabel>
                      <OutlinedInput
                        disabled
                        id="bedrooms"
                        label="Number of Bedrooms"
                        value={bedroom}
                        onChange={e => setBedrooms(e.target.value)}
                      />
                    </FormControl>
                    {/* <Typography component="legend">Raiting</Typography>
                    <Rating name="read-only" value={rate} readOnly /> */}
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel>Amentities</InputLabel>
                      <OutlinedInput
                        disabled
                        id="amentities"
                        label="Disabled"
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
                      </ImageListItem>
                    </ImageList>
                  )}

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
                    </ImageListItem>
                    ))}
                  </ImageList>
                </Stack>
                <Typography variant="h6" gutterBottom>
                  Average Rating
                </Typography>
                <Rating name="read-only" value={rate} readOnly />
                <Typography variant="h6">
                  Making a booking ☎️
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={['DateRangePicker']}
                  >
                    <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }}
                      onChange={(newDate) => {
                        setRange(newDate);
                        console.log(range);
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <br/>
                { localStorage.getItem('token')
                  ? (
                    <>
                      <Button name="submitCreate" variant="contained" onClick={handleBook} >Make a booking</Button>
                      <br/>
                      <br/>
                      <Stack direction="row" justifyContent="space-around">
                        <TextField
                          id="outlined-multiline-static"
                          label="Your comment"
                          multiline
                          rows={4}

                          value={comment}
                          onChange={(event) => {
                            setComment(event.target.value);
                            console.log(comment)
                          }}
                        />
                        <Typography component="legend">Please put your rating Before leaving your comment! 👉 </Typography>
                        <Rating
                          name="simple-controlled"
                          value={value}
                          onChange={(event, newValue) => {
                            console.log(newValue);
                            setValue(newValue);
                          }}
                        />
                      </Stack>
                      <br/>
                      <br/>
                      <Button name="submitCreate" variant="contained" onClick={handleComment} >Leave a comment</Button>
                    </>
                    )
                  : (
                    <>
                      {/* <Button disabled name="submitCreate" variant="contained" onClick={handleBook} >Make a booking</Button> */}
                    </>
                    )}
                <Typography component="legend"> {"Other user's review:"} </Typography>
                {reviews.map((ele) => {
                  return (
                    <>
                      <Rating name="read-only" value={parseInt(ele.rate)} readOnly />
                      <Typography variant="h6" gutterBottom>
                        He/she says: {ele.comment}
                      </Typography>
                      <br/>
                    </>
                  )
                })}
              </CardContent>
              <CardActions>
                <Button variant="contained" onClick={() => setBack(true)}>Back</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </>
  )
}

export default SelectedList;
