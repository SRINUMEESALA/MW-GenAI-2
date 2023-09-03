import React, { useState } from 'react';
import {
  Box,
  FormControlLabel, // Add to imports
  Switch, // Add to imports
} from '@mui/material';

const ResponseFormatToggle = ({ isAudioResponse, setIsAudioResponse }) => {
  const handleToggleChange = (event) => {
    setIsAudioResponse(event.target.checked);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <FormControlLabel
        control={<Switch checked={isAudioResponse} onChange={handleToggleChange} color="primary" />}
        label="Audio response"
      />
    </Box>
  );
};

export default ResponseFormatToggle;
