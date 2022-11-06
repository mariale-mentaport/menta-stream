import React from "react"
import { useState, useEffect } from 'react';
import { useTheme } from "@mui/material/styles";
import {Grid, Container, Typography} from '@mui/material';

import {RequestUplaodNewStream, GetUplaodNewStreamStatus} from 'server/LivepeerSDK';
import StreamCardForm from "ui-component/cards/StreamCardForm";
import CardPlayer from "ui-component/cards/CardPlayer";

function DropStream() {
    const theme = useTheme();
    const [uploadURL, setUploadURL] = React.useState('');
    const [loadingData, setLoadingData]= React.useState(null);
   // const [loadingData, setLoadingData]= React.useState({assetId:'3d67e52a-16fb-4ae0-a5ee-55b9e7d94443'});

    async function NewStreamName(name, email, address, assetId) {
        setLoadingData({assetId:assetId, name: name});
    }
  
    return (
        <Grid justifyContent="center" sx={{ flexGrow: 2 }}  container spacing={4}> 
            <Grid item xs={12} sx={{ m: 3 }} >
                <Typography variant="h5" component="div" align='center' color = { theme.palette.primary.dark}  >
                    Drop Stream
                </Typography>
            </Grid >
            <Grid item xs={12} md={7}>
            { loadingData == null ? (
                <StreamCardForm title ={"Add New Stream"}  CallbackCall = {NewStreamName} />
            ):
            ( <CardPlayer assetId={loadingData.assetId}/> )}
                
            </Grid>
        </Grid>
    );
}

export default DropStream; 