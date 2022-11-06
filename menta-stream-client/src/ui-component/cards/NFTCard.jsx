import React from "react";
//import { makeStyles } from '@mui/styles';
//import Title from 'ui-component/extended/Title';

import { useTheme } from '@mui/material/styles';
//import { Card, CardContent, CardHeader,CardMedia, Divider, Typography, Button, Grid } from '@mui/material';
import { Card, Typography } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

const useStyles = (theme) => ({
  root: {
    position :'relative',
    // borderColor:'white',
    display: 'flex',
    zIndex:1,
    left: '0%',
    top: '0%',
    transform: 'translate(-50%, -30%)',

    flexDirection:"column",
  },
  content:{
    flex:1,
    flexDirection:"column",
    padding:0,
    marginLeft:10,
    marginBottom:0,
  },
  title:{
    display: 'flex',
    flexDirection:"column",
    flex:1,
    justifyContent:'flex-start',
    color:theme.palette.successMain
  },
  titleText:{
    marginTop:10,
    fontSize:20
  },
  media: {
    width: '45%',
    height: 150,
    // height:130,
    margin:10
  },
  info:{
    marginTop:15,
    overflow: 'hidden',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    margin:15
  },
  social:{
    display: 'flex',
    flexDirection:"row",
    flex:1,
  },
  objects:{
    display:'flex',
    flexDirection:'row',
    marginTop:7,
    marginBottom:7,
  },
  icon :{
    marginRight:10,
  },

});


export default function NFTCard({info, nftID, onClose})  {
    
    const theme = useTheme();
    const classes = useStyles(theme);

    const { innerWidth: width, innerHeight: height } = window;
    return (
      <Card className={classes.root} style={{maxWidth :500, width:400 - 20}}>
        <div className={classes.details} >
        
          <div className = {classes.title} >

            <Typography  variant="subtitle1" className = {classes.titleText}>
              {info.name}
            </Typography>
            
            <div className={classes.objects}>
                <Typography variant="body2" color="textSecondary" component="p">
                {info.description}
                </Typography>
            </div>
            
            <div className={classes.objects}>
              
                <div className={classes.objectsInner}>
                  <Typography variant="overline" style={{color:theme.palette.successMain}} >
                  {info.collection}
                  </Typography>
                </div>
               
            </div>
            <div>
                  <Typography variant="overline" style={{color:theme.palette.successMain}} >
                  ID: {nftID}
                  </Typography>
                  
                </div>
          </div>
          <div>
            <IconButton aria-label="cerrar" onClick ={onClose} >
              <CancelIcon   />
            </IconButton>
            </div>
         </div>
         

    </Card>
    );
  }