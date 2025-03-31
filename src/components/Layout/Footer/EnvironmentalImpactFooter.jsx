
import React from "react";
import {
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Flex,
  Box,
  useColorModeValue
} from "@chakra-ui/react";
import { 
  FiDroplet,
  FiFileText,
  FiDollarSign,
  FiTrendingUp
} from "react-icons/fi";

/**
 * Component that displays environmental impact statistics in the footer
 * showing how the electronic user management system reduces waste
 */
const EnvironmentalImpactFooter = () => {
  // Color mode variables for consistent styling with main footer
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const textColor = useColorModeValue("blue.700", "blue.200");
  const iconColor = useColorModeValue("green.500", "green.300");
  const subtleBg = useColorModeValue("blue.100", "blue.800");
  
  // Environmental impact statistics
  const environmentalStats = [
    {
      icon: FiFileText,
      value: "8,500",
      unit: "sheets",
      description: "of paper eliminated monthly"
    },
    {
      icon: FiDollarSign,
      value: "$4,200",
      unit: "",
      description: "annual cost savings"
    },
    {
      icon: FiTrendingUp,
      value: "1.2",
      unit: "tons",
      description: "CO₂ emissions reduced"
    }
  ];
  
  return (
    <VStack align="center" spacing={2}>
      {/* Restore the original droplet icon and its container */}
      <Flex
        align="center"
        justify="center"
        bg={subtleBg}
        boxSize="40px" // Restore original size
        borderRadius="full"
        mb={1}
      >
        <Icon as={FiDroplet} boxSize={4} color={iconColor} /> 
      </Flex>
      <Heading as="h3" size="sm" color={headingColor} textAlign="center" letterSpacing="tight">
        Environmental Impact
      </Heading>
      
      {/* Stats */}
      <VStack align="center" spacing={2}>
        {environmentalStats.map((stat, index) => (
          <HStack key={index} spacing={2}>
            <Icon as={stat.icon} color={iconColor} boxSize={3} />
            <Text fontSize="xs" fontWeight="medium">
              {stat.value} {stat.unit}
            </Text>
            <Text fontSize="xs" color={textColor}>
              {stat.description}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default EnvironmentalImpactFooter;
