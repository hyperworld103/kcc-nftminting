import React, { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import BackupIcon from '@mui/icons-material/Backup';
import { create } from 'ipfs-http-client';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Web3 from 'web3';
import ABI from '../contract/abi.json';
import { contractAddress } from '../contract/contractAddress.js';
import { MERCHANT } from '../contract/merchant.js';
import KSFABI from '../contract/tokenabi.json';
import { tokenAddress } from '../contract/tokenAddress';


var web3, contract, contractToken;

const MAX_SIZE = 52428800; //50MB
const FILE_TYPE = "image/jpeg, image/png, image/gif,  audio/mp3, audio/wav, video/webm, video/mp4, video/mov";
const MINTFEE = "1000000000000000000"; //decimal 18

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  padding: '30px',
  lineHeight: '60px',
}));

const ItemForGrid = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary

}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const client = create('https://ipfs.infura.io:5001/api/v0')

export default function MyDropzone({ step, nextStep, completeStep }) {

  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [mintLoading, setMintLoading] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [notifyType, setNotifyType] = React.useState('');
  const [buffer, setBuffer] = React.useState(10);
  const inputFileRef = React.useRef();
  const progressRef = React.useRef(() => { });
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [account, setAccount] = React.useState('');

  //NFT properties
  const [nftName, setNftName] = React.useState('');
  const [nftType, setNftType] = React.useState('single');
  const [nftCount, setNftCount] = React.useState(1);
  const [nftDesc, setNftDesc] = React.useState('');
  const [custName, setCustName] = React.useState('');
  const [custValue, setCustValue] = React.useState('');
  const [checked, setChecked] = React.useState(false);

  //-------------------------------------------------

  const [artType, setArtType] = React.useState({
    type: 'img',
    file: null
  });

  const validateFields = () => {
    if (nftName == '' || nftCount < 1 || nftDesc == '' || checked == false) {
      setNotification('Please input parameters correctly!', 'error');
      return false;
    } else {
      return true;
    }
  }

  async function uploadMetaJson(url) {
    var metadata = {
      name: nftName,
      description: nftDesc,
      image: url
    }
    metadata[custName] = custValue;
    console.log(metadata);
    var jsonContent = JSON.stringify(metadata);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const metaAdded = await client.add(blob);
    const ipfsMeta = `https://ipfs.infura.io/ipfs/${metaAdded.path}`;

    setMintLoading(true);
    contract.methods.mintToken(account, ipfsMeta).send({ from: account, gas: 200000 }).then((res) => {
      console.log(res);
      setMintLoading(false);
      setNotification('NFT minted successfully!', 'success');
      resetStep();
    }).catch(err => {
      console.log(err);
      setMintLoading(false);
      setNotification('NFT minting failed!', 'error');
    });
    console.log(ipfsMeta);
   
  }
  const resetStep = () => {
    nextStep(0);
    completeStep({});
  }
  async function mint() {
    const file = artType.file;
    const checkParams = validateFields();
    if (checkParams) {
      nextStep(2);
      completeStep({ 0: true, 1: true });
      sendFee(file);
    }
  }

   async function sendFee(file) {
    setSendLoading(true);
    contractToken.methods.transfer(MERCHANT, MINTFEE).send({ from : account, gas : 200000}).then((res) => {
      console.log(res);
      setSendLoading(false);
      setNotification('KSF token transferred succesfully! ', 'success');
      startMinting(file);
    }).catch(err => {
       console.log(err);
       setSendLoading(false);
       setNotification('Transaction Error!', 'error');
       resetStep();
    })
  }

  async function startMinting(file) {
    setLoading(true);
    try {
      const added = await client.add(file)
      console.log(added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url);
      await uploadMetaJson(url);
      setLoading(false);

    } catch (error) {
      setNotification(`Error uploading file!`, 'error');
      console.log('Error uploading file: ', error)
      setLoading(false);
      resetStep();
    }
    
  }

  useEffect(() => {
    if (artType.file) {
      setPreviewUrl(window.URL.createObjectURL(artType.file));
    }
  }, [artType.file]);

  useEffect(() => {
    (async () => {
      web3 = await new Web3(window.ethereum);
      contract = await new web3.eth.Contract(ABI, contractAddress);
      contractToken = await new web3.eth.Contract(KSFABI, tokenAddress);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(account);
      console.log('contractToken',contractToken);
    })();
  }, []);

  const setNotification = (_msg, _type) => {
    setMsg(_msg);
    setNotifyType(_type);
    setOpen(true);
  }

  const handleNFTName = (e) => {

    setNftName(e.target.value);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const [fileUrl, updateFileUrl] = useState(``);

  const triggerInput = () => {
    inputFileRef.current.click();
  }

  function onChange(e) {
    const file = e.target.files[0];
    const fileType = getFileType(file.type);

    nextStep(1);
    completeStep({ 0: true });

    if (file.size > MAX_SIZE) {
      setNotification('File size is too large.', 'success');
      return;
    }
    previewArt(fileType, file);

  }

  const previewArt = (type, _file) => {

    switch (type) {
      case 'image':
        setArtType({ type: 'img', file: _file });
        break;
      case 'audio':
        setArtType({ type: 'audio', file: _file })
        break;
      case 'video':
        setArtType({ type: 'video', file: _file })
        break;
    }
  }

  const getFileType = (str) => {
    const temArr = str.split('/');
    return temArr[0];
  }

  return (
    <section className="container">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        action={action}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}

      >
        <Alert onClose={handleClose} severity={notifyType} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
      {loading && (
        <>
          <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} color="success" />
          <h3>Uploading Meta data information into IPFS...</h3>
        </>
      )
      }
      {
        mintLoading && (
          <>
            <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} color="primary" />
            <h3>Minting NFT...</h3>
          </>
        )
      }
      {
        sendLoading && (
          <>
            <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} color="secondary" />
            <h3>Sending KSF token for Minting Fee...</h3>
          </>
        )
      }
      <section>
        {step === 0 && (
          <Item>
            <Fab size="large" color="default" aria-label="upload" onClick={triggerInput}>
              <BackupIcon />
            </Fab>
            <h3> Click Upload Button</h3>
            <h5>JPG/PNG images, GIFs, WAV/MP3 or WebM/MP4/MOV videos accepted. 50MB limit.</h5>
            <input
              type="file"
              onChange={onChange}
              ref={inputFileRef}
              style={{ display: 'none' }}
              accept={FILE_TYPE}
            />
          </Item>
        )}
        {
          step === 1 && (
            <>
              <h2>Confirm the details of your work before moving on to sign your NFT. Once you mint your NFT, you won’t be able to make any changes</h2>
              <Grid container spacing={6} direction="row-reverse">
                <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Card sx={{ maxWidth: '100%' }} variant="outlined" p={3}>
                      <CardMedia
                        component={artType.type}
                        controls
                        src={previewUrl}
                        alt={artType.type}
                      />
                      <CardContent style={{ backgroundColor: "#373737" }}>
                        <TextField
                          id="outlined-required"
                          label="Name"
                          type="text"
                          name="nftNameforcard"
                          value={nftName}
                          InputProps={{
                            readOnly: true,
                          }}

                        />
                      </CardContent>
                    </Card>
                  </Grid>


                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container >
                    <FormControl component="fieldset" style={{ width: '100%' }}>
                      <h3 >Collection Type</h3>
                      <RadioGroup row aria-label="ctype" name="row-radio-buttons-group" value={nftType}>
                        <FormControlLabel value="single" control={<Radio />} label="Single" />
                        {/* <FormControlLabel value="multiple" control={<Radio />} label="Multiple" /> */}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid container mt={2}>
                    <FormControl component="fieldset" style={{ width: '100%' }}>
                      <TextField
                        required
                        id="outlined-required"
                        label="Number of Copies"
                        type="Number"
                        value={nftCount}
                        onChange={(e) => { setNftCount(e.target.value) }}
                        helperText="Number of copies (only applies to CrossMint1155)"
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid container mt={2}>
                    <FormControl component="fieldset" style={{ width: '100%' }}>
                      <h3 >Properties</h3>
                      <TextField
                        required
                        id="outlined-required"
                        label="Name"
                        type="text"
                        value={nftName}
                        placeholder="Enter your Name"
                        name="nftName"
                        onChange={handleNFTName}

                      />
                    </FormControl>
                  </Grid>
                  <Grid container mt={2}>
                    <FormControl component="fieldset" style={{ width: '100%' }}  >
                      <TextField
                        required
                        id="outlined-required"
                        label="Description"
                        type="text"
                        value={nftDesc}
                        onChange={(e) => { setNftDesc(e.target.value) }}
                        placeholder="Enter your Description"
                        multiline
                        rows={5}

                      />
                    </FormControl>
                  </Grid>
                  <Grid container mt={2}>
                    <h3>Custom Properties (Optional)</h3>
                    <FormControl component="fieldset" style={{ width: '100%' }}  >
                      <Grid container>
                        <Grid item xs={6}>
                          <TextField

                            id="outlined-required"
                            label="Name"
                            type="text"
                            value={custName}
                            placeholder="E.g Date"
                            onChange={(e) => { setCustName(e.target.value) }}


                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField

                            id="outlined-required"
                            label="Value"
                            type="text"
                            value={custValue}
                            placeholder="E.g 27/3"
                            onChange={(e) => { setCustValue(e.target.value) }}
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid container mt={2}>
                    <FormGroup style={{ width: '100%' }}>
                      <FormControlLabel control={<Checkbox checked={checked} />} onChange={() => { setChecked(!checked) }} label="By minting this NFT you agree that these works belong to you and only you. Please respect the creativity of other artists in the space. We would love you for it." />
                    </FormGroup>
                  </Grid>
                  <Grid container mt={2}>
                    <Button variant="contained" color="success" onClick={mint} >Mint NFT</Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )
        }

      </section>
    </section>
  );
}