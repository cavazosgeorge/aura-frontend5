
import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Text,
  Heading,
  Link,
  Divider,
  Icon,
  Center,
  useColorModeValue,
  useBreakpointValue,
  Stack,
} from "@chakra-ui/react";
import {
  FiShield,
  FiMail,
  FiPhone,
  FiGlobe,
  FiUsers,
  FiInfo,
  FiExternalLink,
  FiFileText,
  FiDollarSign,
  FiTrendingUp
} from "react-icons/fi";

const NetZeroLogo = () => (
  <Box width="150px" height="100px"> 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" style={{ backgroundColor: 'transparent' }}>
      {/* NetZero Text with Gradient */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2ecc71"/>
          <stop offset="100%" stopColor="#3498db"/>
        </linearGradient>
      </defs>
      <text x="70" y="75" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="url(#gradient)">NetZero</text>
      
      {/* 2040 with Curved Underline */}
      <text x="95" y="125" fontFamily="Arial, sans-serif" fontSize="46" fontWeight="bold" fill="#34495e">2040</text>
      <path d="M80,135 A60,15 0 0 0 220,135" fill="none" stroke="url(#gradient)" strokeWidth="4"/>
    </svg>
  </Box>
);

function Footer() {
  const location = useLocation();
  
  // Check if current path is login page or login preview
  const isLoginPage = location.pathname === "/login";
  const isViewLoginPage = location.pathname === "/view-login";
  const previewMode = new URLSearchParams(location.search).get('preview') === 'true';
  
  // Don't render the footer on the login page or login preview
  if (isLoginPage || (isViewLoginPage && previewMode)) {
    return null;
  }
  
  // Define environmental stats data here
  const environmentalStats = [
    {
      icon: FiFileText,
      value: "8,500",
      unit: "sheets",
      description: "paper saved monthly"
    },
    {
      icon: FiDollarSign,
      value: "$4,200",
      unit: "",
      description: "cost savings"
    },
    {
      icon: FiTrendingUp,
      value: "1.2 tons",
      unit: "", 
      description: "CO₂ reduced"
    }
  ];

  // Use 2xl containers on very large screens
  const containerSize = useBreakpointValue({ base: "container.xl", "2xl": "container.2xl" });
    
  // Color mode variables for consistent styling with header and navbar
  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "gray.200");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const linkColor = useColorModeValue("blue.600", "blue.300");
  const linkHoverColor = useColorModeValue("blue.700", "blue.200");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const statValueColor = useColorModeValue("blue.600", "blue.300");
  
  // Subtle pattern for background texture - similar to header but more subdued
  const patternOpacity = useColorModeValue("0.03", "0.05");
  
  return (
    <Box
      bg={bg}
      color={textColor}
      py={4}
      borderTopWidth="1px"
      borderTopColor={dividerColor}
      position="relative"
      overflow="hidden"
    >
      {/* Background subtle pattern - similar to HeaderSection but more subdued */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={patternOpacity}
        backgroundImage="url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNNTkuOTk5LDU5Ljk5OSBMNTkuOTk5LDAgTDAsNTkuOTk5IEw1OS45OTksNTkuOTk5IFoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')"
        backgroundSize="20px 20px"
        pointerEvents="none"
      />
      <Container maxW={containerSize}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={3} alignItems="center">
          {/* Company Section */}
          <VStack align="center" spacing={2}>
            <Flex
              align="center"
              justify="center"
              bg={bg}
              boxSize="40px"
              borderRadius="full"
              mb={1}
            >
              <Icon as={FiShield} boxSize={5} color={iconColor} />
            </Flex>
            <Heading
              as="h3"
              size="sm"
              color={headingColor}
              textAlign="center"
              letterSpacing="tight"
            >
              Automation User Request Application
            </Heading>
            <Text fontSize="xs" textAlign="center" color={textColor}>
              Securely manage and request system access for automated production systems.
            </Text>
            <HStack color={textColor} spacing={2}>
              <Icon as={FiGlobe} boxSize={3} />
              <Text fontSize="xs">Kalamazoo, MI</Text>
            </HStack>
          </VStack>
          
          {/* Quick Links */}
          <VStack align="center" spacing={2}>
  <Flex
    align="center"
    justify="center"
    bg={bg}
    boxSize="40px"
    borderRadius="full"
    mb={1}
  >
    <Icon as={FiExternalLink} boxSize={4} color={iconColor} />
  </Flex>
  <Heading
    as="h3"
    size="sm"
    color={headingColor}
    textAlign="center"
    letterSpacing="tight"
  >
    Quick Links
  </Heading>
  <VStack align="center" spacing={2}>
    <Link 
      as={RouterLink} 
      to="/dashboard" 
      color={linkColor} 
      fontSize="sm"
      _hover={{ color: linkHoverColor, textDecoration: "none" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box as="span" mr={2}>→</Box> Dashboard
    </Link>
    <Link 
      as={RouterLink} 
      to="/profile" 
      color={linkColor} 
      fontSize="sm"
      _hover={{ color: linkHoverColor, textDecoration: "none" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box as="span" mr={2}>→</Box> My Profile
    </Link>
    <Link 
      as={RouterLink} 
      to="/about-us" 
      color={linkColor} 
      fontSize="sm"
      _hover={{ color: linkHoverColor, textDecoration: "none" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box as="span" mr={2}>→</Box> About Us
    </Link>
  </VStack>
</VStack>
          
          {/* Contact Section */}
          <VStack align="center" spacing={2}>
            <Flex
              align="center"
              justify="center"
              bg={bg}
              boxSize="40px"
              borderRadius="full"
              mb={1}
            >
              <Icon as={FiMail} boxSize={4} color={iconColor} />
            </Flex>
            <Heading as="h3" size="sm" color={headingColor} textAlign="center" letterSpacing="tight">
              Contact Support
            </Heading>
            <VStack align="center" spacing={2}>
              <HStack spacing={2}>
                <Icon as={FiMail} color={iconColor} boxSize={3} />
                <Text fontSize="xs" fontWeight="medium">DL-USKZO-PA-Center-Infrastructure@pfizer.com</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FiPhone} color={iconColor} boxSize={3} />
                <Text fontSize="xs" fontWeight="medium">(269) 123-4567</Text>
              </HStack> 
            </VStack>
          </VStack>
        </SimpleGrid>
        
        <Divider borderColor={dividerColor} mb={2} />
        
        <Flex 
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          fontSize="xs"
          py={1}
        >
        </Flex>
        {/* NetZero Section - Redesigned with Stat Cards */}
        <Flex 
          direction={{ base: "column", lg: "row" }} 
          align="center" 
          justify="space-between" 
          width="100%" 
          mb={4}
          wrap="wrap"
          gap={4}
          py={1}
        >
          <NetZeroLogo />
          
          <Flex 
            justify="center" 
            align="center" 
            wrap="wrap" 
            gap={{ base: 4, md: 10 }}
          >
            {environmentalStats.map((stat, index) => (
              <HStack 
                key={index} 
                spacing={2}
                align="center"
                minW="120px"
              >
                <Icon as={stat.icon} color={iconColor} boxSize={4} />
                <Text fontSize="md" fontWeight="bold" color={statValueColor}>
                  {stat.value}
                </Text>
                <Text fontSize="xs" color={textColor}>
                  {stat.description}
                </Text>
              </HStack>
            ))}
          </Flex>
        </Flex>
        
        {/* Copyright notice */}
        <Text textAlign="center" fontSize="xs" color={textColor}> 
          &copy; {new Date().getFullYear()} Automation Infrastructure Team. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}

export default Footer;