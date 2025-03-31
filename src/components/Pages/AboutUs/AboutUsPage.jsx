
import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Flex,
  Avatar,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
  Icon,
  Divider,
  useColorModeValue
} from "@chakra-ui/react";
import { 
  FaLaptopCode, 
  FaServer, 
  FaNetworkWired, 
  FaUsers 
} from "react-icons/fa";

// Team Members Data - Grouped by Department
const teamData = [
  {
    department: "Automation Infrastructure",
    members: [
      {
        id: 1,
        name: "Chris Bassler",
        title: "Infrastructure Manager",
        department: "Automation Infrastructure", 
        email: "chris.bassler@company.com",
        phone: "(555) 123-4567",
        location: "Building A - Floor 3",
        employeeId: "EMP20231",
        expertise: ["Team Leadership","Network Security", "Systems Architecture"],
        certifications: ["PLACEHOLDER CERT 1"]
      },
      {
        id: 3,
        name: "George Cavazos",
        title: "Automation Analyst",
        department: "Automation Infrastructure",
        email: "george.cavazos@company.com",
        phone: "(555) 456-7890",
        location: "Building C - Floor 1",
        employeeId: "EMP20234",
        expertise: ["Network Security", "Systems Architecture"],
        certifications: ["PLACEHOLDER CERT 1"]
      },
      {
        id: 2,
        name: "Edjola Smith",
        title: "CyberSecurity Engineer",
        department: "Automation Infrastructure",
        email: "edjola.smith@company.com",
        phone: "(555) 234-5678",
        location: "Building A - Floor 3",
        employeeId: "EMP20232",
        expertise: ["Network Security", "Systems Architecture"],
        certifications: ["PLACEHOLDER CERT 1"]
      },
      {
        id: 6,
        name: "Ken Rivard",
        title: "Automation Analyst",
        department: "Automation Infrastructure",
        email: "ken.rivard@company.com",
        phone: "(555) 555-0006",
        location: "Placeholder Location",
        employeeId: "EMP20237",
        expertise: ["Network Security", "Systems Architecture"],
        certifications: ["PLACEHOLDER CERT 1"]
      },
      {
        id: 8,
        name: "Jason Armstrong",
        title: "Automation Analyst",
        department: "Automation Infrastructure",
        email: "jason.armstrong@company.com",
        phone: "(555) 555-0008",
        location: "Placeholder Location",
        employeeId: "EMP20239",
        expertise: ["Network Security", "Systems Architecture"],
        certifications: ["PLACEHOLDER CERT 1"]
      },
      {
        id: 7,
        name: "Matt Swaney",
        title: "Automation Analyst",
        department: "Automation Infrastructure",
        email: "matt.swaney@company.com",
        phone: "(555) 555-0007",
        location: "Placeholder Location",
        employeeId: "EMP20238",
        expertise: ["Network Security", "Systems Architecture"],
        certifications: ["PLACEHOLDER CERT 1"]
      },
      {
        id: 4,
        name: "Art Keene",
        title: "Automation Analyst",
        department: "Automation Infrastructure",
        email: "art.keene@company.com",
        phone: "(555) 555-0004",
        location: "Placeholder Location",
        employeeId: "EMP20235",
        expertise: ["Network Security", "Systems Architecture"],
        certifications: ["PLACEHOLDER CERT 1"]
      },
      {
        id: 5,
        name: "Todd Jones",
        title: "Automation Analyst",
        department: "Automation Infrastructure",
        email: "todd.jones@company.com",
        phone: "(555) 555-0005",
        location: "Placeholder Location",
        employeeId: "EMP20236",
        expertise: ["Network Security", "Systems Architecture"],
        certifications: ["PLACEHOLDER CERT 1"]
      }
    ]
  },
  {
    department: "Compliance",
    members: [
      {
        id: 9, // New ID
        name: "Katelyn Steers",
        title: "Compliance Analyst",
        department: "Compliance",
        email: "katelyn.steers@company.com",
        phone: "(555) 555-0009",
        location: "Placeholder Location",
        employeeId: "EMP20240",
        expertise: ["Process Validation", "Audit Trail"],
        certifications: ["PLACEHOLDER CERT 1"]
      },
      {
        id: 10, // New ID
        name: "Chris Reyes",
        title: "Compliance Analyst",
        department: "Compliance",
        email: "chris.reyes@company.com",
        phone: "(555) 555-0010",
        location: "Placeholder Location",
        employeeId: "EMP20241",
        expertise: ["Process Validation", "Audit Trail"],
        certifications: ["PLACEHOLDER CERT 1"]
      }
    ]
  }
];

const AboutUsPage = () => {
  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const avatarBg = useColorModeValue("blue.500", "blue.400");
  const expertiseBg = useColorModeValue("gray.100", "gray.700");
  
  return (
    <Box as="section" width="100%" pt={4} pb={6}>
      {/* Header Section */}
      <Box 
        bg={highlightColor}
        pt={{ base: 8, md: 12 }} 
        pb={{ base: 8, md: 12 }}
        px={{ base: 4, md: 8 }}
        mb={8}
      >
        <Flex 
          direction="column" 
          maxW="container.xl" 
          mx="auto"
          align="center"
        >
          <Icon as={FaUsers} boxSize={10} color={avatarBg} mb={3} />
          <Heading size="xl" color={textColor} mb={2}>Our Teams</Heading>
          <Text 
            color={mutedTextColor}
            textAlign="center"
          >
            Meet the experts behind our Automation and Compliance systems
          </Text>
        </Flex>
      </Box>
      
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        {/* Team Members Grid */}
        <Grid 
          templateColumns={{ 
            base: "1fr", 
            md: "repeat(2, 1fr)", 
            lg: "repeat(3, 1fr)" 
          }}
          gap={6}
          mb={8}
        >
          {teamData.map((department, index) => (
            <React.Fragment key={department.department}>
              <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
                <Heading size="lg" mb={4} mt={index > 0 ? 8 : 0} color={textColor}>
                  {department.department} Team
                </Heading>
              </GridItem>
              {department.members.map((member) => (
                <GridItem key={member.id}>
                  <Card 
                    bg={cardBg}
                    borderWidth="1px" 
                    borderColor={borderColor}
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{ 
                    //   transform: "translateY(-2px)",
                      boxShadow: "md"
                    }}
                    height="100%"
                  >
                    <CardBody>
                      <VStack spacing={4} align="center">
                        <Avatar 
                          size="xl" 
                          name={member.name}
                          bg={avatarBg}
                          color="white"
                        />
                        
                        <VStack spacing={1}>
                          <Heading size="md" color={textColor}>{member.name}</Heading>
                          <Text color={mutedTextColor} fontWeight="medium">{member.title}</Text>
                          <Badge 
                            colorScheme="blue" 
                            variant={useColorModeValue("subtle", "solid")}
                            mt={1}
                          >
                            {member.department}
                          </Badge>
                        </VStack>
                        
                        {/* <Divider />
                        
                        <VStack spacing={3} align="start" width="100%" border="1px solid red">
                          <HStack>
                            <Box color={mutedTextColor} width="24px">
                              <Icon as={FaEnvelope} />
                            </Box>
                            <Text color={textColor}>{member.email}</Text>
                          </HStack>
                          
                          <HStack>
                            <Box color={mutedTextColor} width="24px">
                              <Icon as={FaPhone} />
                            </Box>
                            <Text color={textColor}>{member.phone}</Text>
                          </HStack>
                          
                          <HStack>
                            <Box color={mutedTextColor} width="24px">
                              <Icon as={FaBuilding} />
                            </Box>
                            <Text color={textColor}>{member.location}</Text>
                          </HStack>
                          
                          <HStack>
                            <Box color={mutedTextColor} width="24px">
                              <Icon as={FaIdBadge} />
                            </Box>
                            <Text color={textColor}>ID: {member.employeeId}</Text>
                          </HStack>
                        </VStack> */}
                        
                        <Divider />
                        
                        {/* Expertise */}
                        <VStack align="start" width="100%">
                          <Text fontWeight="medium" color={textColor}>Expertise</Text>
                          <Box width="100%">
                            <HStack spacing={2} flexWrap="wrap">
                              {member.expertise.map((skill, index) => (
                                <Badge 
                                  key={index} 
                                  bg={expertiseBg} 
                                  color={textColor}
                                  py={1} 
                                  px={2} 
                                  borderRadius="md"
                                  mb={2}
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </HStack>
                          </Box>
                        </VStack>
                        
                        {/* Certifications */}
                        <VStack align="start" width="100%">
                          <Text fontWeight="medium" color={textColor}>Certifications</Text>
                          <Box width="100%">
                            <HStack spacing={2} flexWrap="wrap">
                              {member.certifications.map((cert, index) => (
                                <Badge 
                                  key={index} 
                                  colorScheme="green" 
                                  variant="subtle"
                                  py={1} 
                                  px={2} 
                                  borderRadius="md"
                                  mb={2}
                                >
                                  {cert}
                                </Badge>
                              ))}
                            </HStack>
                          </Box>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
 
              {/* Conditionally render Team Stats after Infrastructure members */}
              {department.department === "Automation Infrastructure" && (
                <GridItem colSpan={{ base: 1, md: 2, lg: 3 }} mt={8}> {/* Span full width and add top margin */}
                  <Card 
                    bg={cardBg}
                    borderWidth="1px" 
                    borderColor={borderColor}
                    boxShadow="sm"
                  >
                    <CardBody>
                      <Grid 
                        templateColumns={{ 
                          base: "1fr", 
                          md: "repeat(3, 1fr)"
                        }}
                        gap={6}
                        py={4}
                      >
                        <GridItem>
                          <Flex direction="column" align="center">
                            <Icon as={FaServer} boxSize={12} color="blue.500" mb={4} />
                            <Heading size="xl" color={textColor}>99.9%</Heading>
                            <Text color={mutedTextColor} textAlign="center">Infrastructure Uptime</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem>
                          <Flex direction="column" align="center">
                            <Icon as={FaNetworkWired} boxSize={12} color="blue.500" mb={4} />
                            <Heading size="xl" color={textColor}>24/7</Heading>
                            <Text color={mutedTextColor} textAlign="center">Monitoring & Support</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem>
                          <Flex direction="column" align="center">
                            <Icon as={FaLaptopCode} boxSize={12} color="blue.500" mb={4} />
                            <Heading size="xl" color={textColor}>100+</Heading>
                            <Text color={mutedTextColor} textAlign="center">Automation Systems Maintained</Text>
                          </Flex>
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </Card>
                </GridItem>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUsPage;
