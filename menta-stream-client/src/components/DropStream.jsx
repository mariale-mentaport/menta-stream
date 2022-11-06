import React from "react"
import { useState, useEffect } from 'react';
import { useTheme } from "@mui/material/styles";
import {Grid, Container, Typography} from '@mui/material';

import {RequestUplaodNewStream, GetUplaodNewStreamStatus} from 'server/LivepeerSDK';
import StreamCardForm from "ui-component/cards/StreamCardForm";
import CardPlayer from "ui-component/cards/CardPlayer";
import useEth from "contexts/EthContext/useEth";
import { AddNFTbyLocation } from "server/MentaportSDK";



function DropStream() {
    const { state: { contract, accounts,web3 } } = useEth();

    const theme = useTheme();
    const [uploadURL, setUploadURL] = React.useState('');
    const [loadingData, setLoadingData]= React.useState(null);
   // const [loadingData, setLoadingData]= React.useState({assetId:'3d67e52a-16fb-4ae0-a5ee-55b9e7d94443'});

    async function NewStreamName(name, radius, assetId) {
        // mint
        console.log("NewStreamName", accounts)
        try {
            console.log("mint", accounts[0]);
           // await contract.methods.pause(false).send({ from: accounts[0] });
            const mintValue = await contract.methods.mint(1).send({ from: accounts[0], value: web3.utils.toWei('0.05',"ether")}) ;
            contract.getPastEvents('Transfer', {
                fromBlock: mintValue.blockNumber,
                toBlock: 'latest'
            }, function(error, events) {
                if(!error) {
                    let tokenId = 9;
                    for(var i=0;i<events.length;i++){
                        tokenId = events[i].returnValues.tokenId;
                        console.log(events[i].returnValues.tokenId)
                    }
                    if(tokenId > -1){
                      // AddNFTbyLocation(tokenId, accounts[0], radius, name)
                       setLoadingData({assetId:assetId, owner: accounts[0]});
                    }
                }
            });  
           
           // AddNFTbyLocation( accounts[0],radius)
           // setLoadingData({assetId:assetId, name: name});
        } catch(err) {
            console.log("err", err)
        }
    }
  
    return (
        <Grid direction="column"
            alignItems="center"
            justifyContent="center" sx={{ flexGrow: 2 }}  container > 
         
            <Grid item xs={12} md={12} alignItems="center" >
            { loadingData == null ? (
                <StreamCardForm title ={"Add New Stream"}  CallbackCall = {NewStreamName} />
            ):
            ( <CardPlayer assetId={loadingData.assetId} owner= {loadingData.owner} /> )}
                
            </Grid>
        </Grid>
    );
}

export default DropStream; 