import React from "react";
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Card, 
  CardHeader, 
  CardBody, 
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  HStack
} from "@chakra-ui/react";
import { 
  FiUsers, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiClock,
  FiFileText,
  FiCheckSquare,
  FiSearch,
  FiShield
} from "react-icons/fi";

// A simplified dashboard component that doesn't rely on backend API calls
const SimpleDashboard = () => {
  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  
  // Mock data for the dashboard
  const stats = [
    { 
      label: "Total Users", 
      value: 1248, 
      change: "+12% from last month", 
      icon: FiUsers,
      color: "blue" 
    },
    { 
      label: "Active Requests", 
      value: 42, 
      change: "5 new today", 
      icon: FiClock,
      color: "orange" 
    },
    { 
      label: "Approved", 
      value: 867, 
      change: "93% approval rate", 
      icon: FiCheckCircle,
      color: "green" 
    },
    { 
      label: "Rejected", 
      value: 23, 
      change: "7% rejection rate", 
      icon: FiAlertCircle,
      color: "red" 
    }
  ];
  
  return (
    <Box>
      <Container maxW="container.xl" py={6}>
        {/* Welcome Section */}
        <Box mb={8}>
          <Heading size="lg" mb={2}>Welcome to the Dashboard</Heading>
          <Text color={mutedTextColor}>
            Manage user access requests and approvals from a central location
          </Text>
        </Box>
        
        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
            >
              <CardBody>
                <Flex align="center">
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={`${stat.color}.50`}
                    color={`${stat.color}.500`}
                    mr={4}
                  >
                    <Icon as={stat.icon} boxSize={6} />
                  </Box>
                  <Stat>
                    <StatLabel color={mutedTextColor}>{stat.label}</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold">{stat.value}</StatNumber>
                    <StatHelpText mb={0}>{stat.change}</StatHelpText>
                  </Stat>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
        
        {/* Main Content Tabs */}
        <Card 
          bg={cardBg}
          borderWidth="1px" 
          borderColor={borderColor}
          boxShadow="sm"
        >
          <CardHeader pb={0}>
            <Heading size="md">Access Management</Heading>
          </CardHeader>
          <CardBody>
            <Tabs colorScheme="blue" variant="enclosed">
              <TabList mb={4}>
                <Tab><HStack><Icon as={FiFileText} mr={2} />Requests</HStack></Tab>
                <Tab><HStack><Icon as={FiCheckSquare} mr={2} />Approvals</HStack></Tab>
                <Tab><HStack><Icon as={FiSearch} mr={2} />Lookup</HStack></Tab>
                <Tab><HStack><Icon as={FiShield} mr={2} />Compliance</HStack></Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Heading size="sm" mb={4}>Recent Access Requests</Heading>
                    <Text>This is a placeholder for the Requests tab content.</Text>
                    <Text mt={2}>You can customize this section with your UI components.</Text>
                    <Button colorScheme="blue" mt={4}>New Request</Button>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Heading size="sm" mb={4}>Pending Approvals</Heading>
                    <Text>This is a placeholder for the Approvals tab content.</Text>
                    <Text mt={2}>You can customize this section with your UI components.</Text>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Heading size="sm" mb={4}>User Lookup</Heading>
                    <Text>This is a placeholder for the Lookup tab content.</Text>
                    <Text mt={2}>You can customize this section with your UI components.</Text>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Heading size="sm" mb={4}>Compliance Reports</Heading>
                    <Text>This is a placeholder for the Compliance tab content.</Text>
                    <Text mt={2}>You can customize this section with your UI components.</Text>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default SimpleDashboard;