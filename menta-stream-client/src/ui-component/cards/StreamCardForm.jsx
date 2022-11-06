import React from "react"
import { useState, useEffect } from 'react';
import {AppBar,Toolbar,  Grid, Box, Container} from '@mui/material';
import {Button,Card, CardActions, CardContent, CardMedia} from '@mui/material';
import {CssBaseline, Stack, TextField, Typography, Link} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from '@mui/lab';

import {GetUplaodNewStreamStatus} from 'server/LivepeerSDK';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { useAsset, useCreateAsset } from '@livepeer/react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from '@mui/material';

const StreamCardForm = (props) => {
    const theme = useTheme();
    const {image, title, info, CallbackCall} = props;
    const [errorMsg, setErrorMsg] = useState('');
    const [formValues, setFormValues] = useState();
    const [video, setVideo] = useState();
    const [loadingData, setLoadData] = useState(false);
   
    const [loadingProgress, setLoadingProgress] = useState(0);
    const {
      mutate: createAsset,
      data: asset,
      uploadProgress,
      status,
      error,
    } = useCreateAsset();

    useEffect(() => {
        if(asset?.id) {
            const fetchData = async () => {
                let data = await GetUplaodNewStreamStatus(asset?.id);
                while(data.phase != 'ready'){
                    data = await GetUplaodNewStreamStatus(asset?.id);
                    console.log(data)
                    setLoadingProgress(Math.floor(data.progress * 100))
                }
                setLoadData(false);
                CallbackCall(formValues.streamName, formValues.email, formValues.address, asset?.id);
            }
              // call the function
              fetchData()
        }
    });

    function LoadingVideo() {

        return (
            <>
            <Typography sx={{ fontSize: 20}} color="text.secondary" gutterBottom>
             Upload Progress: {loadingProgress}
            </Typography>
         </>
        );
    }

    return (
        <Card sx={{  display: 'flex', flexDirection: 'column', maxWidth:400 }}>
        {/* <CardMedia component="img" image={"images/upload_small.png"} alt="upload" height="250"
        /> */}
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontSize: 20}} color="text.secondary" gutterBottom>
                <CloudUploadIcon color="primary" sx={{ fontSize: 50, mr:3, mb:-1 }}/> 
                 {title}
             </Typography>
            {asset && (
               <LoadingVideo />
            )}
            {error && <div>{error.message}</div>}
            <Formik
                initialValues={{
                    streamName: '',
                    email: '',
                    address: 'ENS',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    streamName: Yup.string().min(5).max(255).required('Stream name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    address: Yup.string().min(5).max(255).required('ENS/Address is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    console.log(values)
                    if (video) {
                        if (video) {
                            setLoadData(true);
                            setFormValues({name:values.streamName, email:values.email, address:values.address});
                            await createAsset({
                              name: values.streamName,
                              file: video,
                            });
                           
                        }
                    
                       // 
                    }
                   else{ setErrors({ submit: "Add video" }); }
                    
                } catch (err) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} >
                    <FormControl fullWidth  sx={{ ...theme.typography.customInput }}>
                        <OutlinedInput
                            type="file"
                            label="Stream Name"
                            accept="video/*"
                            onChange={(e) => setVideo(e?.target?.files?.[0])}
                        />
                    
                    </FormControl>
                    <FormControl fullWidth error={Boolean(touched.streamName && errors.streamName)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-streamname">Stream Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-streamname"
                            type="streamname"
                            value={values.streamName}
                            name="streamName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Stream Name"
                            inputProps={{}}
                        />
                        {touched.streamName && errors.streamName && (
                            <FormHelperText error id="standard-weight-helper-text-streamname">
                                {errors.streamName}
                            </FormHelperText>
                        )}
                    </FormControl>
                    
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email">Email Address</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Email Address"
                            inputProps={{}}
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error id="standard-weight-helper-text-email">
                                {errors.email}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        fullWidth
                        error={Boolean(touched.adress && errors.adress)}
                        sx={{ ...theme.typography.customInput }}
                    >
                        <InputLabel htmlFor="outlined-adornment-address">Drop your address or ENS here</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-address"
                            type='text'
                            value={values.adress}
                            name="address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Address"
                            inputProps={{}}
                        />
                        {touched.address && errors.address && (
                            <FormHelperText error id="standard-weight-helper-text-address">
                                {errors.address}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={true}
                                    name="checked"
                                    color="primary"
                                    style={{
                                        transform: "scale(.8)",
                                    }}
                                />
                            }
                            label={<Typography variant="subtitle2">
                            <Link href="https://www.mentaport.xyz/terms-of-service"  target="_blank" sx={{ ml: 1}}  style={{ textDecoration: 'none' }} > 
                            Accept terms & conditions
                            </Link>
                            </Typography>}
                        
                        />
                    
                    </Stack>
                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                        {loadingData ?(
                            <LoadingButton loading variant='outlined'  fullWidth>
                            {"New Stream"}
                            </LoadingButton>
                        ) :
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                            New Stream
                            </Button>
                    }
                
                    </Box>
                </form>
            )}
            </Formik>
        </CardContent>
          
    </Card>
    );
}

export default StreamCardForm