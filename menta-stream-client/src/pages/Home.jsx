import React from 'react';

import { useTheme } from "@mui/material/styles";
import {Grid, Button, Typography} from '@mui/material';
import { Link } from 'react-router-dom';
import {Card, CardActions, CardContent} from '@mui/material';
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import MapCard from 'components/Map/Map';
import DropStream from 'components/DropStream';


const initialList = [];
const listNFTReducer = (state, action) => {
  // console.log(action.type, state);
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        listNFT: state.listNFT.concat({
          key: action.key,
          location: action.location,
        }),
      };
    default:
      throw new Error();
  }
};


function Home() {
    const theme = useTheme();
    const inputlocation = React.createRef();
    const [isLoading, setLoading] = React.useState(true);
    const [action, setAction] = React.useState('look');

    React.useEffect(() => {
      setLoading(false);
    }, []);

    //-------------------------------------------------------------------------
    const [listNFTData, dispatchListData] = React.useReducer(listNFTReducer, {
        listNFT: initialList,
        isShowList: true,
    });
    function handleAdd(key, location) {
        dispatchListData({ type: "ADD_ITEM", key, location });
    }
    //-------------------------------------------------------------------------
    const handleActionChange = (event, newAction) => {
        setAction(newAction);
    };

    function requestAPIKey() {
        alert("Coming soon")
    }
    return (
        <Grid justifyContent="center" sx={{ flexGrow: 2 }}   container spacing={4}>  
            <Grid item xs={12} sx={{ m: 3 }} >
                <Typography variant="h3" component="div" align='center' color = { theme.palette.primary.dark}  >
                    Menta Stream
                </Typography>
           </Grid >
            <Grid item xs={12} sx={{ m: 0 }} align='center'>
            <ToggleButtonGroup
                color="primary"
                value={action}
                exclusive
                onChange={handleActionChange}
                >
                <ToggleButton value="look">Looking Stream</ToggleButton>
                <ToggleButton value="drop">Drop Stream</ToggleButton>
                </ToggleButtonGroup>
            </Grid>

            {/* IF IN LOOK SHOW MAP ELSE SHOW ADD NFT */}
            {action == 'look' ? (
                <Grid item xs={12} md={7}>
                 {/* MAP VIEW COMPONENTS */}
                    <FormControl fullWidth sx={{ mb: 1 }}>
                        <InputLabel htmlFor="location-search">Location</InputLabel>
                        <OutlinedInput
                            id="location-search"
                            inputRef={inputlocation}
                            label="Location"
                        />
                    </FormControl>
                    <MapCard
                        listNFT={listNFTData.listNFT}
                        locationRef={inputlocation}
                        handleAdd={handleAdd}
                        isLoading={isLoading}
                    />
                </Grid>
            ) : (
                 
                <Grid item xs={12} md={7}>
                {/* DROP VIEW COMPONENTS */}
                    <DropStream />
                </Grid>
            )}
           

        </Grid>
    );
}

export default Home; 