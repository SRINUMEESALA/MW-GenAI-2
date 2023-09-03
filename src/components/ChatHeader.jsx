import React from 'react';
import { Typography, AppBar, Toolbar, Box } from '@mui/material';

const ChatHeader = () => {
  const logoImage = `${process.env.PUBLIC_URL}/logo.png`;
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
        width: '100%',
        height: 100,
        alignItems: 'center',
      }}
      elevation={0}
      
    >
      <Toolbar sx={{ padding: 0, margin: 0 }}>
        <img
          src={logoImage}
          style={{ maxWidth: 300, flexGrow: 1, textAlign: 'center', padding: 0, margin: 0 }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;
