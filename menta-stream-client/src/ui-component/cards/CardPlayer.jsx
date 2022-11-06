import React from "react"
import { useState, useEffect } from 'react';
import {Button,Card, CardActions, CardContent,} from '@mui/material';
import {extField, Typography, Link} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from '@mui/lab';

import { useAsset } from '@livepeer/react';
import { Player } from '@livepeer/react';
 

 const CardPlayer = (props) => {
    const { assetId} = props;
    const { data: asset } = useAsset(assetId);
    return (
        <Card sx={{  display: 'flex', flexDirection: 'column', maxWidth:400 }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Player
                title={asset?.name}
                playbackId={asset?.playbackId}
                // poster={<PosterImage />}
                showPipButton
                />
            </CardContent>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontSize: 20}} color="text.secondary" gutterBottom>
                    {asset?.name}
                </Typography>
            </CardContent>
        </Card>
  );
};
export default CardPlayer