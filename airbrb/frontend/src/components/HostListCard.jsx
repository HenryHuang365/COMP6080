import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import defaulthouse from './img/defaulthouse.jpg'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import SendIcon from '@mui/icons-material/Send';
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCallDelete, apiCallPut, apiCallGet } from './apiHelper';
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import timezone from 'dayjs/plugin/timezone'; // Import Timezone plugin
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);
// Use the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone to Sydney
dayjs.tz.setDefault('Australia/Sydney');
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '90vh', // Maximum height
  overflowY: 'auto', // Enable vertical scrolling
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const HostListCard = (props) => {
  console.log('props')
  console.log(props)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rating, setRating] = React.useState(0);
  const [ranges, setRanges] = React.useState([[null, null]]);
  // const [bookings, setBookings] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    let totalRating = 0;
    for (const rate of props.card.listing.reviews) {
      totalRating += rate.rate;
    }
    if (props.card.listing.reviews.length > 0) {
      setRating(totalRating / props.card.listing.reviews.length);
    } else {
      setRating(0);
    }
  }, [props.card.reviews]);

  const handleRemove = async () => {
    try {
      await apiCallDelete(props.token, `listings/${props.card.id}`, {}, '', true);
      props.setCards(props.cards.filter((item) => item.id !== props.card.id))
      props.setmodalTitle('Success');
      props.setmodalContent(`successfully delete the property ${props.card.listing.title}`);
      props.setOpen(true);
      navigate('/hostlist')
    } catch (error) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
  }
  const nothing = () => {
    console.log('NOthing for debug')
  }
  const deleteBookings = async (listingId) => {
    try {
      const datas = await apiCallGet(props.token, 'bookings', {}, '', true);
      console.log('props card.id', listingId);
      for (const book of datas.bookings) {
        console.log('bookings listingId', book.listingId)
        parseInt(book.listingId) === parseInt(listingId) ? apiCallPut(props.token, `bookings/decline/${book.id}`, {}, '', true) : nothing();
      }
    } catch (error) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
  }

  const handleUnpublish = async () => {
    try {
      await apiCallPut(props.token, `listings/unpublish/${props.card.id}`, {}, '', true);
      deleteBookings(props.card.id);
      props.setmodalTitle('Success');
      props.setmodalContent(`successfully unpublish the property ${props.card.listing.title}`);
      props.setOpen(true);
      navigate('/hostlist')
    } catch (error) {
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
    }
  }

  const clearRanges = () => {
    const newRanges = [[null, null]];
    setRanges(newRanges);
  }
  const handleAddRange = () => {
    const newRanges = [...ranges];
    newRanges.push([null, null]);
    setRanges(newRanges);
  }
  const handlePush = async () => {
    console.log('RANGE IS HERE')
    for (const range of ranges) {
      if (range[0] === null || range[1] === null) {
        props.setmodalTitle('An error has occured');
        props.setmodalContent('Please fill the date');
        props.setOpen(true);
        return;
      }
    }
    const doRangesIntersect = (range1, range2) => {
      const [start1, end1] = range1;
      const [start2, end2] = range2;
      return start1.isBefore(end2) && end1.isAfter(start2);
    }

    const aggregateRanges = (range1, range2) => {
      // aggregate the date
      // if (range1[0].isSame(range2[0]) && range1[1].isSame(range2[1])) {
      //   return range1
      // }
      const aggregatedStart = dayjs.min(range1[0], range2[0]);
      const aggregatedEnd = dayjs.max(range1[1], range2[1]);
      return [aggregatedStart, aggregatedEnd];
    }
    function makeRangesUnique (ranges) {
      const uniqueRanges = [];
      ranges.forEach(range => {
        if (!uniqueRanges.some(uniqueRange =>
          uniqueRange[0].isSame(range[0]) && uniqueRange[1].isSame(range[1])
        )) {
          uniqueRanges.push(range);
        }
      });

      return uniqueRanges;
    }

    // aggreate the date object
    let aggList = [...ranges]
    while (true) {
      let newAggList = [];
      let noOverlap = true;
      for (let i = 0; i < aggList.length; i++) {
        let ifPush = true;
        for (let j = 0; j < aggList.length; j++) {
          if (aggList[i][0].isSame(aggList[j][0]) && aggList[i][1].isSame(aggList[j][1])) {
            // ignore the same range, only compare the different range and combie them
            // console.log(`push samerange ${aggList[i]}`)
            continue;
          } else if (doRangesIntersect(aggList[i], aggList[j])) {
            // two range intersect, combine them
            console.log(`OVERLAP ${aggList[i]} ${aggList[j]}`)
            noOverlap = false;
            ifPush = false;
            // console.log(`push intersect ${aggregateRanges(aggList[i], aggList[j])}`)
            newAggList.push(aggregateRanges(aggList[i], aggList[j]));
          } else {
            // console.log(`push unique range ${aggList[i]}, ${aggList[j]}`)
          }

          if (ifPush) newAggList.push(aggList[i]);
        }
      }
      if (noOverlap) {
        break
      }
      console.log(newAggList);
      newAggList = makeRangesUnique(newAggList)

      aggList = newAggList;
    }
    aggList = makeRangesUnique(aggList)
    // map the list in the application form
    aggList = aggList.map((range) => { return { start: dayjs(range[0]).tz('Australia/Sydney').format(), end: dayjs(range[1]).tz('Australia/Sydney').format() } })
    const reqBody = {
      availability: aggList
    }
    // request a publish
    console.log(aggList);
    try {
      await apiCallPut(props.token, `listings/publish/${props.card.id}`, reqBody, '', true)
      console.log(aggList);
      props.setmodalTitle('Success');
      props.setmodalContent(`successfully publish property ${props.card.listing.title} with id ${props.card.id}`);
      props.setOpen(true);
      handleClose()
    } catch (error) {
      // document.getElementById()
      props.setmodalTitle('An error has occured');
      props.setmodalContent(error);
      props.setOpen(true);
      handleClose()
    }
  }
  return (
    <>
      <Card sx={{ maxWidth: 345 }} id={`${props.card.listing.title}-hostlistcard`}>
        <CardMedia
          sx={{ height: 140 }}
          image={props.card.listing.thumbnail ? props.card.listing.thumbnail : defaulthouse}
          title="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.card.listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Property Type: {props.card.listing.metadata.type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Number of beds: {props.card.listing.metadata.bed}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Number of bathrooms: {props.card.listing.metadata.bath}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Number of total reviews: {props.card.listing.reviews.length}
          </Typography>
          <Typography component="legend">Rating</Typography>
          <Rating name="read-only" value={rating} readOnly />
          <Typography variant="body2">
            Price: {props.card.listing.price}$ per night
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" id={`editbut${props.card.listing.title}`} onClick={() => { navigate(`/editlisting/${props.card.id}`) }}>Edit</Button>
          <Button size="small" onClick={handleRemove}>Remove</Button>
          <Button id={`${props.card.listing.title}pushbtn`} onClick={handleOpen}>Go Live</Button>
          <Button onClick={handleUnpublish}>Unpublish</Button>
        </CardActions>
      </Card>
      {/* push live modal */}
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Stack
                direction="column"
                spacing={5}
                justifyContent="space-around"
              >
                <Typography id="transition-modal-title" variant="h6" component="h2">
                  Push your property named {props.card.listing.title}
                </Typography>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                  Ready to push, tell us when your property is avaliable
                </Typography>
                <Button
                  variant="contained"
                  sx={ { textTransform: 'none' } }
                  onClick={handleAddRange}
                >
                  Add avaliability ranges +
                </Button>
                <Button
                  variant="contained"
                  sx={ { textTransform: 'none' } }
                  onClick={clearRanges}
                >
                  Clear date ranges 🗑️
                </Button>
                {ranges.map((ele, idx) => {
                  return (
                    <>
                      <Typography id={`${props.card.listing.title}${idx}date`}>
                        date {idx}
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={['DateRangePicker']}
                        >
                          <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }}
                            value={ele}
                            onChange={(newDate) => {
                              const newRanges = [...ranges];
                              newRanges[idx] = newDate;
                              setRanges(newRanges);
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </>
                  )
                })}
                <Button id={`${props.card.listing.title}livebtn`} variant="contained" endIcon={<SendIcon />} onClick={handlePush}>
                  Go Live
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
}

export default HostListCard;
