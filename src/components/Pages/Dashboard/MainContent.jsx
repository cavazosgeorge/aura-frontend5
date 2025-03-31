import React from "react";
import { Box, Container, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import MainTabs from "../Dashboard/MainTabs";

function MainContent() {
  // Use semantic tokens for consistent dark mode styling
  const bg = useColorModeValue("gray.50", "darkMode.bg");
  const color = useColorModeValue("gray.800", "darkMode.text");
  const mutedTextColor = useColorModeValue("gray.600", "darkMode.muted");
  const headingColor = useColorModeValue("brand.700", "brand.200");
  
  return (
    <Box 
      flex="1" 
      // bg={bg}
      bg="white"
      color={color} 
      pt={16} // Further increased top padding for more space below header
      pb={8} // Also increased bottom padding
      display="flex"
      flexDirection="column"
      transition="background 0.2s ease-in-out"
    >
      <Container 
        maxW="container.xl" 
        px={{ base: 4, md: 0 }}
        height="100%"
      >
        {/* Welcome Section */}
        <Box mb={10}>
          <Heading size="lg" mb={4} color={headingColor}>
            Welcome to the Dashboard
          </Heading>
          <Text color={mutedTextColor}>
            Manage user access requests and approvals from a central location
          </Text>
        </Box>
        
        
        {/* Main Tabs */}
        <MainTabs />
      </Container>
    </Box>
  );
}

export default MainContent;