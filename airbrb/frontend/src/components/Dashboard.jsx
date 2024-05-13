import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { apiCallGet } from './apiHelper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AllListCard from './AllListCard';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import timezone from 'dayjs/plugin/timezone'; // Import Timezone plugin
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);
// Use the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [cards, setCards] = React.useState([]);
  const [minBedrooms, setMinBedrooms] = React.useState('');
  const [maxBedrooms, setMaxBedrooms] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [sortReviews, setSortReviews] = React.useState(false);
  const [shownCard, setShownCard] = React.useState([]);
  const [keyword, setKeyword] = React.useState('');
  const [dateRange, setdateRange] = React.useState([null, null]);
  // const [dateSearch, setdateSearch] = React.useState('');
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const datas = await apiCallGet(props.token, 'listings', {}, '', true)
        const fetchPromises = datas.listings.map(async (ele) => {
          const detail = await apiCallGet(props.token, `listings/${ele.id}`, {}, '', true);
          return { ...detail, id: ele.id };
        });
        let detailList = await Promise.all(fetchPromises);
        // alphabetical
        detailList = detailList.sort((a, b) => a.listing.title.localeCompare(b.listing.title));
        // only show the published card
        setCards(detailList.filter((ele) => ele.listing.published));
        setShownCard(detailList.filter((ele) => ele.listing.published));
        // sort by title

        console.log('all detail list');
        console.log(detailList);
      } catch (error) {
        props.setmodalTitle('An error has occured');
        props.setmodalContent(error);
        props.setOpen(true);
      }
    }
    fetchData();
    localStorage.removeItem('dateRangeSearch')
    console.log('USEFFECT')
  }, [navigate]);

  const listingReviews = (reviews) => {
    let totalRating = 0;
    for (const review of reviews) {
      totalRating += review.rate;
    }
    if (reviews.length > 0) {
      return (totalRating / reviews.length);
    } else {
      return 0;
    }
  }
  const parseDate = (dateString) => {
    return new Date(dateString);
  }

  const isWithinRange = (checkRange, availability) => {
    const [checkStart, checkEnd] = checkRange.map(parseDate);
    console.log(`Checking for ${checkStart} to ${checkEnd}`)
    return availability.some(period => {
      const start = parseDate(period.start);
      const end = parseDate(period.end);
      console.log(`Is in ${start} to ${end} ?`)
      return start <= checkStart && end >= checkEnd;
    });
  }

  const cardfilter = () => {
    const newlist = [...cards];
    // fiter by condition
    let filterList = newlist.filter((item) =>
      (keyword ? (item.listing.title.toLowerCase().includes(keyword.toLowerCase()) || item.listing.address.city.toLowerCase().includes(keyword.toLowerCase())) : true) &&
      (minBedrooms ? (parseInt(minBedrooms) <= parseInt(item.listing.metadata.bed)) : true) &&
      (maxBedrooms ? (parseInt(maxBedrooms) >= parseInt(item.listing.metadata.bed)) : true) &&
      (minPrice ? (parseInt(minPrice) <= parseInt(item.listing.price)) : true) &&
      (maxPrice ? (parseInt(maxPrice) >= parseInt(item.listing.price)) : true) &&
      ((dateRange[0] && dateRange[1]) ? (isWithinRange(dateRange, item.listing.availability)) : true)
    );

    // if sortReviews is true, then sort by review rating
    if (sortReviews) {
      filterList = filterList.sort((a, b) => {
        console.log('COMPARE', listingReviews(b.listing.reviews) - listingReviews(a.listing.reviews));
        return listingReviews(b.listing.reviews) - listingReviews(a.listing.reviews)
      });
    }

    if (dateRange[0] && dateRange[1]) {
      // user use date filter, set it to true
      const startDate = dayjs(dateRange[0]);
      const endDate = dayjs(dateRange[1]);
      // calculate the difference in days
      const differenceInDays = endDate.diff(startDate, 'day');
      console.log('difference', differenceInDays);
      localStorage.setItem('dateRangeSearch', differenceInDays);
    } else {
      localStorage.removeItem('dateRangeSearch')
    }
    setShownCard(filterList);
  }

  return (
    <>
      <Stack
        direction="column"
        spacing={8}
        sx={{
          display: 'flex',
          // Additional styles if needed
        }}
      >
      <Typography variant="h3" gutterBottom>
        Welcome to all Listings! 🌴
      </Typography>
      <Divider variant="middle" />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: 'flex',
          // Additional styles if needed
        }}
      >
        <TextField
          id="search"
          label="keyword"
          variant="outlined"
          onChange={e => setKeyword(e.target.value)}
        />
        <TextField
          id="n of bedrooms"
          label="Min.Number of bedrooms"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => setMinBedrooms(e.target.value)}
        />
        <Typography variant="h4" gutterBottom>
          -
        </Typography>
        <TextField
          id="n of bedrooms"
          label="Max.Number of bedrooms"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => setMaxBedrooms(e.target.value)}
        />

        <TextField
          id="min price"
          label="Min. Price"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => setMinPrice(e.target.value)}
        />
        <Typography variant="h4" gutterBottom>
          -
        </Typography>
        <TextField
          id="max price"
          label="Max.Price"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => setMaxPrice(e.target.value)}
        />
        <FormControlLabel control={<Checkbox onClick={(e) => { setSortReviews(e.target.checked); console.log(e.target.checked) } } />} label="Sort By Reviews(High to Low)" />
      </Stack>
      <Typography id="transition-modal-date">
        date filter:
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={['DateRangePicker']}
        >
          <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }}
            onChange={(newDate) => {
              setdateRange(newDate);
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      </Stack>

  <Button variant="contained" onClick={ cardfilter }>Search 🔍</Button>
  <Divider variant="middle" />
  <Stack
    flexWrap="wrap"
    direction="row"
    spacing={5}
    justifyContent="space-around flex-start"
    useFlexGap
  >
    {shownCard.map((card) => {
      // generate property card one by one
      return (
        <>
          <AllListCard showCard = {shownCard} card = {card} token = {props.token} cards = {cards} setCards = {setCards} setOpen = {props.setOpen} setmodalTitle = {props.setmodalTitle} setmodalContent = {props.setmodalContent}/>
        </>
      )
    })}
</Stack>
    </>
  )
}

export default Dashboard;
