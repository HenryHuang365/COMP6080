import React from 'react';
// code is copied from Hadyden week 8 lecture demo code.
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import HostListCard from './HostListCard';
import Typography from '@mui/material/Typography';
import { apiCallGet } from './apiHelper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
const HostList = (props) => {
  const navigate = useNavigate();
  const [cards, setCards] = React.useState([]);
  React.useEffect(() => {
    console.log('REFRESH HOSTLIST TOKEN')
    console.log(localStorage.getItem('token'))
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      console.log('USEFFECTAAA')
      const fetchData = async () => {
        try {
          const datas = await apiCallGet(props.token, 'listings', {}, '', true)
          // map all element to a list of fetch, then use a promisis to wait
          // const fetchPromises = datas.listings.map(ele => {
          //   return apiCallGet(props.token, `listings/${ele.id}`, {}, '', true);
          // });
          // const detailList = await Promise.all(fetchPromises);
          const fetchPromises = datas.listings.map(async (ele) => {
            // recursive fetch, also add the id to the detail dictionary
            const detail = await apiCallGet(props.token, `listings/${ele.id}`, {}, '', true);
            return { ...detail, id: ele.id };
          });
          const detailList = await Promise.all(fetchPromises);
          // filter out the listing that does not belong to the current user
          setCards(detailList.filter((item) => item.listing.owner === localStorage.getItem('curremail')))
          console.log('detail list');
          console.log(detailList);
        } catch (error) {
          props.setmodalTitle('An error has occured');
          props.setmodalContent(error);
          props.setOpen(true);
        }
      }
      fetchData();
    //   setCards([{
    //     title: 'Oceanside Villa',
    //     owner: 'alina@unsw.edu.au',
    //     address: {},
    //     price: 350,
    //     thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
    //     metadata: {
    //       type: 'House',
    //       bedN: 3,
    //       bathN: 3
    //     },
    //     reviews: [
    //       {
    //         rate: 3,
    //         comment: 'good'
    //       }
    //     ],
    //     availability: [
    //       {}
    //     ],
    //     published: true,
    //     postedOn: '2020-10-31T14:45:21.077Z'
    //   }])
    }
  }, [navigate]);
  // const addCards = () => {

  // }
  console.log(cards)
  return (
    <>

      <Typography variant="h3" gutterBottom>
        Welcome to Hosted Listings! 🏠
      </Typography>
      <Button
        variant="contained"
        name="createButton"
        sx={ { textTransform: 'none', width: 200 } }
        onClick={() => { navigate('/createlisting') }}
      >
        Create new property +
      </Button>
      <Divider variant="middle" />
      <Stack
        flexWrap="wrap"
        direction="row"
        spacing={5}
        justifyContent="space-around flex-start"
        useFlexGap
      >
        {cards.map((card) => {
          // generate property card one by one
          console.log('HI')
          console.log(card)
          return (
            <>
              <HostListCard card = {card} token = {props.token} cards = {cards} setCards = {setCards} setOpen = {props.setOpen} setmodalTitle = {props.setmodalTitle} setmodalContent = {props.setmodalContent}/>
            </>
          )
        })}
      </Stack>
    </>
  )
}

export default HostList;
