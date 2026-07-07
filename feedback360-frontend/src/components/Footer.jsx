import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid rgba(59, 130, 246, 0.18)',
        bgcolor: '#ffffff',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Plus Jakarta Sans' }}>
        © {new Date().getFullYear()} Feedback360. Tous droits réservés. Intégré avec TalentUp.
      </Typography>
    </Box>
  );
};

export default Footer;
