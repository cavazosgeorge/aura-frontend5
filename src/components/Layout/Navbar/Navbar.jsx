import React from "react";
import { config } from "../../../config/environment";
import {
  Box,
  Container,
  Flex,
  Spacer,
  useColorModeValue,
  useBreakpointValue
} from "@chakra-ui/react";
import { useLocation, useSearchParams } from "react-router-dom";
import AnnouncementBanner from "../../Overlays/Popup/AnnouncementBanner";
import ColorModeToggle from "../ColorModeToggle";
import useAuthStore from "../../../stores/authStore";

// Import modular components
// import NavbarLogo from "./NavbarLogo";
import NavbarNavigation from "./NavbarNavigation";
import NavbarUserMenu from "./NavbarUserMenu";

function Navbar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAuthStore(state => state.user);
  
  // Check if current path is login page
  const isLoginPage = location.pathname === "/login";
  
  // Check if we're on the login page with preview parameter
  const isPreviewMode = isLoginPage && searchParams.get("preview") === "true";
  
  // Check if we're on the dashboard page
  const isDashboardPage = location.pathname === "/dashboard";
  
  // Use 2xl containers on very large screens, but only when not on login page
  const containerSize = !isLoginPage 
    ? useBreakpointValue({ base: "container.xl", "2xl": "container.2xl" }) 
    : undefined;
  
  // Get the current environment
  const currentEnv = import.meta.env.VITE_APP_ENV || 'local';
  
  // Color mode variables for consistent styling
  const gradientBg = useColorModeValue(
    "linear-gradient(to right, #2b6cb0, #3182ce, #4299e1)",
    "linear-gradient(to right, #1a365d, #2a4365, #2c5282)"
  );
  const dividerColor = useColorModeValue("blue.300", "blue.600");

  return (
    <Box>
      <AnnouncementBanner message="Support for KZOPA only. Support for additional systems coming soon!" />
      <Box 
        className="navbar-container"
        bg={gradientBg}
        color="white" 
        w="100%" 
        boxSizing="border-box"
        boxShadow="lg"
        borderBottomWidth="1px"
        borderBottomColor={dividerColor}
        position="fixed"
        top="0"
        zIndex="1100" 
        overflow="hidden"
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
        <Container maxW={containerSize} px={isLoginPage ? 0 : undefined}>
          <Flex
            alignItems="center"
            h="4rem"
            px={isLoginPage ? { base: 4, md: 6 } : undefined}
            justifyContent="space-between"
          >
            
            <Spacer />
            
            {/* Only show navigation buttons when logged in */}
            {user && (
              <>
                {/* Navigation Links component */}
                <NavbarNavigation />
                
                {/* User Profile Dropdown component */}
                <NavbarUserMenu />
                
                {/* Color Mode Toggle */}
                <Box ml={2}>
                  <ColorModeToggle />
                </Box>
              </>
            )}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default Navbar;
