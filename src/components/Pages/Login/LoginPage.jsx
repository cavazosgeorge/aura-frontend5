import React, { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { fetchData } from "../../../../utils/ApiUtility";
import useAuthStore from "../../../stores/authStore";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  VStack,
  HStack,
  Icon,
  Divider,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { FiShield, FiLock } from "react-icons/fi";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const { loading: contextLoading } = useContext(AuthContext);

  // Use Zustand store for authentication - use separate selectors to avoid infinite loop
  const storeUser = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const login = useAuthStore((state) => state.login);

  // Animation keyframes
  const pulseKeyframes = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
    100% { transform: scale(1); opacity: 1; }
  `;
  const pulseDuration = "3s";

  // Hover effects
  const logoHoverScale = {
    transform: "scale(1.15)",
    transition: "transform 0.3s ease-in-out",
  };

  // More subtle hover for feature icons
  const subtleHoverScale = {
    transform: "scale(1.08)",
    transition: "transform 0.3s ease-in-out",
  };

  // Very subtle hover for security badge
  const verySubtleHoverScale = {
    transform: "scale(1.03)",
    transition: "transform 0.3s ease-in-out",
  };

  // Responsive adjustments
  const logoSize = useBreakpointValue({ base: 8, md: 10, lg: 12 });

  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBgDark = "rgba(26, 32, 44, 0.8)"; // Darker but slightly transparent background for dark mode
  const borderColor = useColorModeValue("gray.200", "blue.700");
  const textColor = useColorModeValue("gray.800", "white"); // Brighter text in dark mode
  const mutedTextColor = useColorModeValue("gray.600", "blue.100"); // Brighter secondary text in dark mode
  const iconColor = useColorModeValue("blue.600", "blue.300");
  const secondaryColor = useColorModeValue("gray.500", "blue.200"); // Brighter secondary color in dark mode
  const inputBgDark = "rgba(45, 55, 72, 0.3)"; // Slightly lighter input background for dark mode
  const buttonTextColor = useColorModeValue("white", "white"); // Ensure button text is white in both modes

  // Modern gradient background - matching the header section
  const gradientLight = "linear-gradient(to right, #2b6cb0, #3182ce, #4299e1)";
  const gradientDark = "linear-gradient(to right, #1a365d, #2a4365, #2c5282)";
  const sidebarBg = useColorModeValue(gradientLight, gradientDark);

  // Additional color mode values that were previously inside the JSX
  const bodyBg = useColorModeValue("gray.50", "gray.900");
  const bodyBgGradient = useColorModeValue(
    "linear-gradient(to bottom right, rgba(240, 240, 250, 0.9), rgba(255, 255, 255, 0.9))",
    "linear-gradient(to bottom right, rgba(20, 20, 30, 0.9), rgba(30, 30, 45, 0.9))",
  );
  const cardBoxShadow = useColorModeValue(
    "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 5px 15px -5px rgba(0, 0, 0, 0.05)",
    "0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 5px 15px -5px rgba(0, 0, 0, 0.3)",
  );
  const inputBg = useColorModeValue("white", inputBgDark);
  const placeholderColor = useColorModeValue("gray.500", "blue.100");
  const textOpacity = useColorModeValue(0.8, 0.9);

  // Get URL search params
  const location = useLocation();
  const previewMode =
    new URLSearchParams(location.search).get("preview") === "true";

  // Redirect if already logged in (but not in preview mode)
  useEffect(() => {
    if (storeUser && !loading && !previewMode) {
      navigate("/dashboard");
    }
  }, [storeUser, loading, navigate, previewMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      // Use the login function from the auth store
      await login(username, password);

      // Navigate to dashboard on successful login
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.message ||
          "Authentication failed. Please check your credentials.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Flex align="center" justify="center" flexGrow={1}>
        <Spinner size="xl" color={iconColor} thickness="4px" />
      </Flex>
    );
  }

  return (
    // This makes sure the login page takes exactly the space available
    <Flex direction="column" flex="1" overflow="hidden">
      <Grid templateColumns={{ base: "1fr", md: "5fr 7fr" }} flex="1">
        {/* Sidebar/Banner - Hidden on mobile */}
        <GridItem
          display={{ base: "none", md: "flex" }}
          bg={sidebarBg}
          color="white"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={{ base: 4, lg: 10 }}
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: "url('/images/pattern.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "30px",
            zIndex: 0,
          }}
        >
          <VStack spacing={8} zIndex={1} textAlign="center" maxW="400px">
            {/* Logo and Title */}
            <VStack spacing={0}>
              <Heading size="xl" textAlign="center">
                Welcome to
              </Heading>
              <HStack spacing={2} alignItems="baseline">
                <Heading size="xl" textAlign="center">
                  AURA
                </Heading>
                <Text fontSize="md" fontWeight="bold" opacity={0.8}>
                  v2.0
                </Text>
              </HStack>
              <Text fontSize="lg" opacity={0.9} mt={1}>
                Automation User Request Application
              </Text>
            </VStack>

            <Text fontSize="lg" textAlign="center" opacity={0.9}>
              Securely manage and request automation system access
            </Text>

            <Divider borderColor="whiteAlpha.300" />

            {/* Feature Highlights */}
            <VStack spacing={4} align="start" width="100%">
              <HStack spacing={3}>
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
                  <Icon as={FaUser} />
                </Flex>
                <Text>Manage user access requests</Text>
              </HStack>
              <HStack spacing={3}>
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
                  <Icon as={FiLock} />
                </Flex>
                <Text>Control security compliance</Text>
              </HStack>
              <HStack spacing={3}>
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
                  <Icon as={FaSignInAlt} />
                </Flex>
                <Text>Streamline approval workflows</Text>
              </HStack>
            </VStack>
          </VStack>
        </GridItem>

        {/* Login Form */}
        <GridItem>
          <Flex
            align="center"
            justify="center"
            p={{ base: 4, md: 8 }}
            height="100%"
            bg={bodyBg}
            backgroundImage={bodyBgGradient}
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 512 512%22%3E%3Cpath fill=%22rgba(0, 0, 0, 0.02)%22 d=%22M464 0H144c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM362 464H54c-3.3 0-6-2.7-6-6V150c0-3.3 2.7-6 6-6h42v224c0 26.5 21.5 48 48 48h224v42c0 3.3-2.7 6-6 6zm96-96H150c-3.3 0-6-2.7-6-6V54c0-3.3 2.7-6 6-6h308c3.3 0 6 2.7 6 6v308c0 3.3-2.7 6-6 6z%22%3E%3C/path%3E%3C/svg%3E')",
              backgroundRepeat: "repeat",
              backgroundSize: "30px",
              opacity: 0.5,
              zIndex: 0,
            }}
          >
            <Card
              width={{ base: "100%", sm: "450px" }}
              bg={cardBg}
              borderWidth="1px"
              borderColor="1px solid red"
              borderRadius="lg"
              boxShadow={cardBoxShadow}
              p={2}
              position="relative"
              zIndex="1"
              overflow="hidden"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                zIndex: 1,
              }}
            >
              <CardHeader pb={0}>
                <VStack spacing={4} align="center">
                  {/* Mobile logo - visible only on mobile */}
                  <Box
                    display={{ base: "block", md: "none" }}
                    mb={4}
                    position="relative"
                    animation={`${pulseKeyframes} ${pulseDuration} infinite`}
                    _hover={logoHoverScale}
                  >
                    <Icon as={FiShield} boxSize="3rem" color={iconColor} />
                  </Box>

                  <Heading
                    as="h2"
                    size="lg"
                    textAlign="center"
                    color={textColor}
                  >
                    Account Login
                  </Heading>

                  <Text color={mutedTextColor}>
                    Enter your AMER credentials to access the portal
                  </Text>
                </VStack>
              </CardHeader>

              <CardBody pt={6}>
                {error && (
                  <Alert status="error" mb={6} borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleLogin}>
                  <VStack spacing={6}>
                    <FormControl id="username">
                      <FormLabel color={textColor}>Username</FormLabel>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          children={<Icon as={FaUser} color={iconColor} />}
                        />
                        <Input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                          required
                          isDisabled={isLoggingIn}
                          size="lg"
                          borderColor={borderColor}
                          bg={inputBg}
                          color={textColor}
                          _placeholder={{
                            color: placeholderColor,
                            opacity: 0.7,
                          }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px blue.400",
                          }}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl id="password">
                      <FormLabel color={textColor}>Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          children={<Icon as={FaLock} color={iconColor} />}
                        />
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          isDisabled={isLoggingIn}
                          size="lg"
                          borderColor={borderColor}
                          bg={inputBg}
                          color={textColor}
                          _placeholder={{
                            color: placeholderColor,
                            opacity: 0.7,
                          }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px blue.400",
                          }}
                        />
                      </InputGroup>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={isLoggingIn}
                      loadingText="Signing In"
                      rightIcon={<FaSignInAlt />}
                      boxShadow="md"
                      bgGradient={sidebarBg}
                      color={buttonTextColor}
                      fontWeight="bold"
                      _hover={{
                        boxShadow: "md",
                        opacity: 0.95,
                      }}
                      _active={{
                        transform: "translateY(0)",
                        boxShadow: "md",
                      }}
                      height="45px"
                      mt={4}
                      transition="all 0.2s"
                    >
                      Sign In
                    </Button>
                  </VStack>
                </form>

                <Text
                  fontSize="sm"
                  color={mutedTextColor}
                  textAlign="center"
                  mt={6}
                  fontStyle="italic"
                  opacity={textOpacity}
                >
                  Contact Automation Infrastructure for account assistance
                </Text>
              </CardBody>
            </Card>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default LoginPage;
