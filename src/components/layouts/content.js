import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stepper from '../layouts/stepper';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export default function SimpleContainer(status) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container style = {{padding : '5% 0'}}>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container  >
        <Grid item xs={12} md={12}>
          <Item style = {{padding : '50px 7%'}}>
          <Typography variant="h5" gutterBottom component="div" style = {{ color : '#4cc5c1', fontWeight : 'bold'}}>
            Mint an NFT!
          </Typography>
          <Stepper/>
          </Item>
        </Grid>
      </Grid>
    </Box>
      </Container>
    </React.Fragment>
  );
}