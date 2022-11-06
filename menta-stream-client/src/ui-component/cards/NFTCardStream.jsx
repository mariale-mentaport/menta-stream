import React from "react"
import {Button,Card, CardContent,CardHeader} from '@mui/material';
import {Typography, Link} from '@mui/material';

import { useAsset } from '@livepeer/react';
import { Player } from '@livepeer/react';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

 const NFTCardStream = (props) => {
    const { assetId, owner, onClose} = props;
    const { data: asset } = useAsset(assetId);
    return (
        <Card sx={{  display: 'flex', flexDirection: 'column', maxWidth:400 }}>
           <CardHeader
                action={
                    <IconButton aria-label="cerrar" onClick ={onClose} >
                    <CancelIcon   />
                  </IconButton>
                }/>
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
                <Typography sx={{ fontSize: 12}} color="text.secondary" gutterBottom>
                    {owner}
                </Typography>
            </CardContent>
        </Card>
  );
};
export default NFTCardStream