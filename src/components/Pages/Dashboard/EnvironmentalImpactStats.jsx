import React from "react";
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Flex,
  Icon,
  Heading,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { 
  FaLeaf, 
  FaTree, 
  FaFileAlt, 
  FaDollarSign 
} from "react-icons/fa";

/**
 * Component that displays environmental impact statistics
 * showing how the electronic user management system reduces waste
 */
const EnvironmentalImpactStats = () => {
  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "darkMode.card");
  const borderColor = useColorModeValue("gray.200", "darkMode.border");
  const textColor = useColorModeValue("gray.800", "darkMode.text");
  const mutedTextColor = useColorModeValue("gray.600", "darkMode.muted");
  const iconColor = useColorModeValue("green.500", "green.300");
  
  // Environmental impact statistics
  const environmentalStats = [
    {
      icon: FaTree,
      value: "12",
      unit: "trees",
      description: "Saved annually by reducing paper usage"
    },
    {
      icon: FaFileAlt,
      value: "8,500",
      unit: "sheets",
      description: "Paper forms eliminated per month"
    },
    {
      icon: FaDollarSign,
      value: "$4,200",
      unit: "",
      description: "Annual cost savings on paper and printing"
    },
    {
      icon: FaLeaf,
      value: "1.2",
      unit: "tons",
      description: "CO₂ emissions reduced annually"
    }
  ];
  
  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      mb={6}
    >
      <CardBody>
        <Text 
          fontSize="lg" 
          fontWeight="medium" 
          mb={4} 
          color={textColor}
        >
          Environmental Impact
        </Text>
        
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)"
          }}
          gap={6}
        >
          {environmentalStats.map((stat, index) => (
            <GridItem key={index}>
              <Flex direction="column" align="center">
                <Icon 
                  as={stat.icon} 
                  boxSize={12} 
                  color={iconColor} 
                  mb={4} 
                />
                <Flex align="baseline">
                  <Heading size="xl" color={textColor}>
                    {stat.value}
                  </Heading>
                  {stat.unit && (
                    <Text 
                      ml={1} 
                      fontSize="lg" 
                      color={textColor} 
                      fontWeight="medium"
                    >
                      {stat.unit}
                    </Text>
                  )}
                </Flex>
                <Text 
                  color={mutedTextColor} 
                  textAlign="center" 
                  fontSize="sm"
                >
                  {stat.description}
                </Text>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </CardBody>
    </Card>
  );
};

export default EnvironmentalImpactStats;