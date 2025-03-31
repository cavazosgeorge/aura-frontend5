import React from "react";
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  VStack,
  Icon,
  useColorModeValue,
  HStack,
  Tooltip,
  Badge,
  useBreakpointValue
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { 
  FiShield, 
  FiLock, 
  FiUsers, 
  FiRefreshCw, 
  FiCheckCircle 
} from "react-icons/fi";

/**
 * HeaderSection component
 * 
 * Displays the main application header with AURA branding and security information
 * AURA stands for Automation User Request Application
 * 
 * @returns {JSX.Element} Rendered HeaderSection component
 */
function HeaderSection() {
  // Color mode variables for consistent styling
  const bg = useColorModeValue("blue.600", "blue.800");
  const gradientBg = useColorModeValue(
    "linear-gradient(to right, #2b6cb0, #3182ce, #4299e1)",
    "linear-gradient(to right, #1a365d, #2a4365, #2c5282)"
  );
  const color = "white";
  const secondaryColor = useColorModeValue("blue.100", "blue.200");
  const iconColor = useColorModeValue("blue.200", "blue.300");
  const dividerColor = useColorModeValue("blue.300", "blue.600");
  const badgeBg = useColorModeValue("blue.100", "blue.700");
  const badgeColor = useColorModeValue("blue.800", "blue.100");
  
  // Animation for the shield icon
  const pulseKeyframes = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.9; }
    100% { transform: scale(1); opacity: 1; }
  `;
  const pulseDuration = "3s";
  
  // Hover animation for icons
  const logoHoverScale = {
    transform: "scale(1.15)",
    transition: "transform 0.3s ease-in-out"
  };
  
  // More subtle hover for feature icons
  const subtleHoverScale = {
    transform: "scale(1.08)",
    transition: "transform 0.3s ease-in-out"
  };
  
  // Very subtle hover for security badge
  const verySubtleHoverScale = {
    transform: "scale(1.03)",
    transition: "transform 0.3s ease-in-out"
  };
  
  // Responsive adjustments
  const logoSize = useBreakpointValue({ base: 8, md: 10, lg: 12 });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl", lg: "2xl" });
  const showFullTitle = useBreakpointValue({ base: false, lg: true });
  
  return (
    <Box
      bg={gradientBg}
      color={color}
      py={{ base: 4, md: 6 }}
      borderBottomWidth="1px"
      borderBottomColor={dividerColor}
      boxShadow="lg"
      transition="all 0.3s"
      position="relative"
      overflow="hidden"
      zIndex="0" // Lower z-index to ensure navbar dropdowns appear on top
    >
      {/* Background subtle pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.05"
        backgroundImage="url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNNTkuOTk5LDU5Ljk5OSBMNTkuOTk5LDAgTDAsNTkuOTk5IEw1OS45OTksNTkuOTk5IFoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')"
        backgroundSize="20px 20px"
        pointerEvents="none"
      />
      
      <Container maxW="container.xl">
        <Flex 
          direction={{ base: "column", md: "row" }} 
          align={{ base: "center", md: "center" }}
          justify={{ base: "center", md: "space-between" }}
          py={{ base: 2, md: 0 }}
        >
          <HStack spacing={4} mb={{ base: 4, md: 0 }}>
            <Box
              position="relative"
              animation={`${pulseKeyframes} ${pulseDuration} infinite`}
              _hover={logoHoverScale}
            >
              <Icon 
                as={FiShield} 
                boxSize={logoSize} 
                color={iconColor} 
              />
            </Box>
            
            <VStack spacing={0} align="flex-start">
              <Heading
                size={headingSize}
                fontWeight="bold"
                lineHeight="1.2"
                letterSpacing="tight"
              >
                AURA
                <Badge 
                  ml={2} 
                  bg={badgeBg} 
                  color={badgeColor} 
                  fontSize="xs" 
                  borderRadius="md"
                  px={2}
                  py={0.5}
                  verticalAlign="middle"
                >
                  v2.0
                </Badge>
              </Heading>
              
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="medium"
                color={secondaryColor}
                display={showFullTitle ? "block" : "none"}
              >
                Automation User Request Application
              </Text>
            </VStack>
          </HStack>
          
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            {/* Security Badge */}
            <Flex
              bg="rgba(0, 0, 0, 0.15)"
              py={2}
              px={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor="rgba(255, 255, 255, 0.15)"
              boxShadow="0 2px 5px rgba(0, 0, 0, 0.1)"
              _hover={{ 
                bg: "rgba(0, 0, 0, 0.2)",
                ...verySubtleHoverScale
              }}
              transition="all 0.2s"
              cursor="pointer"
            >
                <Icon as={FiLock} boxSize={5} color={iconColor} mr={2} />
                <VStack spacing={0} align="flex-start">
                  <Text fontWeight="medium" fontSize="sm">
                    Secure Access Management
                  </Text>
                  <Text fontSize="xs" color={secondaryColor}>
                    Enterprise Access Control System
                  </Text>
                </VStack>
              </Flex>
            
            {/* Features Icons - Updated to match LoginPage style */}
            <HStack spacing={3} ml={2}>
              <Tooltip label="User Management" placement="bottom">
                <Flex
                  p={2}
                  borderRadius="full"
                  bg="rgba(255, 255, 255, 0.1)"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    ...subtleHoverScale,
                  }}
                  transition="all 0.2s"
                >
                  <Icon as={FiUsers} boxSize={5} color={iconColor} />
                </Flex>
              </Tooltip>
              
              <Tooltip label="Automation Workflows" placement="bottom">
                <Flex
                  p={2}
                  borderRadius="full"
                  bg="rgba(255, 255, 255, 0.1)"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    ...subtleHoverScale,
                  }}
                  transition="all 0.2s"
                >
                  <Icon as={FiRefreshCw} boxSize={5} color={iconColor} />
                </Flex>
              </Tooltip>
              
              <Tooltip label="Compliance Verified" placement="bottom">
                <Flex
                  p={2}
                  borderRadius="full"
                  bg="rgba(255, 255, 255, 0.1)"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    ...subtleHoverScale,
                  }}
                  transition="all 0.2s"
                >
                  <Icon as={FiCheckCircle} boxSize={5} color={iconColor} />
                </Flex>
              </Tooltip>
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

export default HeaderSection;