import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import defaulthouse from './img/defaulthouse.jpg'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import timezone from 'dayjs/plugin/timezone'; // Import Timezone plugin
import minMax from 'dayjs/plugin/minMax';
import { useNavigate } from 'react-router-dom';

dayjs.extend(minMax);
// Use the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone to Sydney
dayjs.tz.setDefault('Australia/Sydney');

const AllListCard = (props) => {
  // const [rating, setRating] = React.useState(0);
  const getRating = () => {
    let totalRating = 0;
    for (const rate of props.card.listing.reviews) {
      totalRating += rate.rate;
    }
    if (props.card.listing.reviews.length > 0) {
      return totalRating / props.card.listing.reviews.length
    } else {
      return 0;
    }
  }
  const navigate = useNavigate();

  return (
    <>
      <Card
        sx={{ maxWidth: 345 }}
        id={`${props.card.listing.title}-alllistcard`}
        onClick={() => { navigate(`/selectlisting/${props.card.id}`) }}
        style={{
          cursor: 'pointer',
        }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image={props.card.listing.thumbnail ? props.card.listing.thumbnail : defaulthouse}
          title="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.card.listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {/* Property Type: {props.card.metadata.type} */}
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
          <Typography component="legend">Raiting</Typography>
          <Rating name="read-only" value={getRating()} readOnly />
          <Typography variant="body2">
            Price: {props.card.listing.price}$ per night
          </Typography>
        </CardContent>
      </Card>
      {/* push live modal */}
    </>
  );
}

export default AllListCard;
