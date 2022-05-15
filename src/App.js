import * as React from 'react';
import Content from './components/layouts/content'
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import Fab from '@mui/material/Fab';
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Web3 from 'web3';
var web3;


const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 36,
  padding: 6,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#DDDDDD' : '#DDDDDD',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#21827F' : '#fff',
    width: 34,
    height: 34,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      border: theme.palette.mode === 'dark' ? '1px solid teal' : '1px solid white',
      borderRadius: '60%',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#000',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));
const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function MyApp() {

  const [balance, setBalance] = React.useState(0);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  React.useEffect(() => {
    (async () => {
      if (window.ethereum) {
        web3 = await new Web3(window.ethereum);

      } else {
        alert('Install Metamask wallet');
      }

    })();
  }, []);

  React.useEffect(() => {
    if (window.innerWidth < 1093) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [window.innerWidth]);
  async function getBalance(addr) {
    var balKCS = await web3.eth.getBalance(addr);
    var balanceConverted = balKCS / (10 ** 18);
    setBalance(balanceConverted);
    console.log(balanceConverted);
  }

  async function connectWallet() {
    if (window.ethereum) {

      await window.ethereum
        .request({ method: 'eth_requestAccounts' });
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x141' }]
      });
      const accountArr = await web3.eth.getAccounts();
      getBalance(accountArr[0]);
      setIsConnected(true);

    }
  }

  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [isConnected, setIsConnected] = React.useState(false); //Check Wallet connect status

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button onClick={() => { window.location.href = '/home' }} >
          <ListItemIcon>
            <HomeIcon /> &nbsp; Home
          </ListItemIcon>
          <ListItemText />
        </ListItem>
        <ListItem button onClick={() => { window.location.href = '/analytics' }} >
          <ListItemIcon>
            <EqualizerIcon /> &nbsp; Analytics
          </ListItemIcon>
          <ListItemText />
        </ListItem>
        <ListItem button onClick={() => { window.location.href = '/staking' }} >
          <ListItemIcon>
            <MonetizationOnIcon /> &nbsp; Staking
          </ListItemIcon>
          <ListItemText />
        </ListItem>
        <ListItem button onClick={() => { window.location.href = '/multiSender' }} >
          <ListItemIcon>
            <SendIcon /> &nbsp; MultiSender
          </ListItemIcon>
          <ListItemText />
        </ListItem>
      </List>
      <Divider />

      <FormControlLabel
        control={<MaterialUISwitch sx={{ m: 3 }} defaultChecked
          onChange={colorMode.toggleColorMode}
          name="toggleDarks"
          color="default" />}
        label=""
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '80px'
        }}
      />

    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div>
        {['left'].map((anchor) => (
          <React.Fragment key={anchor}>

            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>
      <AppBar position="static" color="default">
        <Container>
          <Toolbar >
            {
              isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={toggleDrawer('left', true)}
                  sx={{ mr: 2, display: { sm: 'block' } }}
                >
                  <MenuIcon />
                </IconButton>
              )
            }

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => {
                window.location.href = '/';
              }}
            >
              <Avatar alt="KCC logo" src="/imgs/logo.jfif" sx={{ width: 35, height: 35 }} />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
              className="default-font"
            >
              RS Finance
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="primary" onClick={() => { window.location.href = '/home' }} >
                <HomeIcon /> &nbsp; Home
              </Button>
              <Button color="primary" onClick={() => { window.location.href = '/analytics' }} >
                <EqualizerIcon /> &nbsp; Analytics
              </Button>
              <Button color="primary" onClick={() => { window.location.href = '/staking' }} >
                <MonetizationOnIcon /> &nbsp; Staking
              </Button>
              <Button color="primary" onClick={() => { window.location.href = '/multisender' }} >
                <SendIcon /> &nbsp; MultiSender
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

              <FormGroup>
                <FormControlLabel
                  control={<MaterialUISwitch sx={{ m: 3 }} defaultChecked
                    onChange={colorMode.toggleColorMode}
                    name="toggleDark"
                    color="default" />}
                  label=""
                />

              </FormGroup>
            </Box>
            {
              isConnected === true ? (
                <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                  <Fab variant="extended" color="inherit" style={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgb(60 52 52)' : '#fff' }}>
                    <h5 className="wallet">{balance.toString().substring(0, 6)} KCS</h5>&nbsp;
                    <Avatar alt="KCC logo" src="/imgs/network.png" />
                  </Fab>
                </Box>
              ) : (
                <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                  <LoadingButton variant="outlined" color="primary" onClick={connectWallet}>
                    <AccountBalanceWalletIcon /> &nbsp; Connect Wallet
                  </LoadingButton>
                </Box>
              )
            }

          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>

  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState('dark');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <MyApp />
        <Content />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
