import React, { useState } from 'react';
import {
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Box,
} from '@chakra-ui/react';

const AnnouncementBanner = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Box width="100%">
      <Alert status="info" width="100%">
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={() => setIsVisible(false)}
        />
      </Alert>
    </Box>
  );
};

export default AnnouncementBanner;