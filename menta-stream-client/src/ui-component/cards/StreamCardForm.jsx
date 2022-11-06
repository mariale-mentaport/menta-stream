import React from "react"
import { useState, useEffect } from 'react';
import {Button,Card,CardContent, Box} from '@mui/material';
import  {Stack, Typography, Link} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from '@mui/lab';

import {GetUplaodNewStreamStatus} from 'server/LivepeerSDK';

import * as Yup from 'yup';
import { Formik } from 'formik';

import {useCreateAsset } from '@livepeer/react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    OutlinedInput,
} from '@mui/material';

const StreamCardForm = (props) => {
    const theme = useTheme();
    const {title, info, CallbackCall} = props;
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
                // TODO: FIX ISSUE WHEN FAILES LOADING
                while(data.phase != 'ready') {
                    data = await GetUplaodNewStreamStatus(asset?.id);
                    console.log(data)
                    setLoadingProgress(Math.floor(data.progress * 100))
                }
                // done uplloading!
                setLoadingProgress(100);
                DoneUploading(asset?.id);
            }
            // call the function
            fetchData()
        }
    });

    function DoneUploading(id) {
        setLoadData(false);
        console.log("DoneUploading")
        // now mint
        CallbackCall(formValues.streamName, formValues.radius, id);
    }

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
        <Card sx={{  display: 'flex', flexDirection: 'column', maxWidth:500 }}>
     
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
                    radius: '',
                    // address: 'ENS',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    streamName: Yup.string().min(5).max(255).required('Stream name is required'),
                    radius: Yup.number().required('need a radius'),
                   // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    // address: Yup.string().min(5).max(255).required('ENS/Address is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    console.log(values)
                    if (video) {
                       console.log("here")
                        setLoadData(true);
                        await setFormValues({streamName:values.streamName, radius:values.radius});
                        //DoneUploading('7f2906ca-3bc4-4413-9a03-47693d704366');
                        
                        await createAsset({
                          name: values.streamName,
                          file: video,
                        });
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
                    <FormControl fullWidth error={Boolean(touched.streamName && errors.streamName)} sx={{ ...theme.typography.customInput,mt:5}}>
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
                    
                    <FormControl
                        fullWidth
                        error={Boolean(touched.radius && errors.radius)}
                        sx={{ ...theme.typography.customInput ,mt:5}}>
                    
                        <InputLabel htmlFor="outlined-adornment-radius">Radius of drop</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-radius"
                            type='text'
                            value={values.radius}
                            name="radius"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Radius"
                            inputProps={{}}
                        />
                        {touched.radius && errors.radius && (
                            <FormHelperText error id="standard-weight-helper-text-radius">
                                {errors.radius}
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