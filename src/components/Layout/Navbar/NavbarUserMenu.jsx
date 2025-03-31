import React, { useEffect } from "react";
import {
  Box,
  Button,
  Avatar,
  HStack,
  Text,
  Icon,
  Divider,
  useColorModeValue
} from "@chakra-ui/react";
import { 
  FiUser, 
  FiLogOut, 
  FiSettings, 
  FiChevronDown
} from "react-icons/fi";
import useAuthStore from "../../../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";

function NavbarUserMenu() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Menu styling
  const menuBg = useColorModeValue("white", "gray.800");
  const menuItemHoverBg = useColorModeValue("gray.100", "gray.700");
  const menuItemColor = useColorModeValue("gray.800", "white");
  const menuItemMutedColor = useColorModeValue("gray.600", "blue.200");
  const logoutHoverBg = useColorModeValue("red.50", "red.900");
  const logoutHoverColor = useColorModeValue("red.600", "red.200");
  const iconColor = useColorModeValue("blue.200", "blue.300");
  const activeItemBg = useColorModeValue("blue.50", "blue.900");
  const activeItemColor = useColorModeValue("blue.600", "blue.200");
  
  // Initialize dropdown display state
  useEffect(() => {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      dropdown.style.display = 'none';
      dropdown.style.opacity = '0';
      dropdown.style.transform = 'translateY(-10px)';
      dropdown.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      const dropdown = document.getElementById('user-dropdown');
      const button = document.getElementById('user-menu-button');
      
      if (dropdown && button && !dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.style.display = 'none';
      }
    }
    
    // Position the dropdown correctly
    function positionDropdown() {
      const button = document.getElementById('user-menu-button');
      const dropdown = document.getElementById('user-dropdown');
      
      if (button && dropdown) {
        const buttonRect = button.getBoundingClientRect();
        const navbarBottom = document.querySelector('.navbar-container')?.getBoundingClientRect().bottom || buttonRect.bottom;
        dropdown.style.top = navbarBottom + 'px';
        dropdown.style.right = (window.innerWidth - buttonRect.right) + 'px';
        dropdown.style.marginTop = '0'; // Remove any margin
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', positionDropdown);
    
    // Initial positioning
    positionDropdown();
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', positionDropdown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box position="relative" zIndex="9999">
      <Button
        id="user-menu-button"
        variant="ghost"
        color="white"
        borderRadius="md"
        px={4}
        py={2}
        _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
        _active={{ bg: "rgba(255, 255, 255, 0.3)" }}
        rightIcon={<Icon as={FiChevronDown} color={iconColor} />}
        onClick={() => {
          // Toggle a custom dropdown instead of using Chakra's Menu
          const dropdown = document.getElementById('user-dropdown');
          const button = document.getElementById('user-menu-button');
          
          if (dropdown && button) {
            // Position the dropdown based on the navbar bottom
            const buttonRect = button.getBoundingClientRect();
            const navbarBottom = document.querySelector('.navbar-container')?.getBoundingClientRect().bottom || buttonRect.bottom;
            dropdown.style.top = navbarBottom + 'px';
            dropdown.style.right = (window.innerWidth - buttonRect.right) + 'px';
            dropdown.style.marginTop = '0'; // Remove any margin
            
            // Toggle visibility with animation
            if (dropdown.style.display === 'none') {
              dropdown.style.display = 'block';
              // Use setTimeout to ensure the display change has taken effect before animating
              setTimeout(() => {
                dropdown.style.opacity = '1';
                dropdown.style.transform = 'translateY(0)';
              }, 10);
            } else {
              dropdown.style.opacity = '0';
              dropdown.style.transform = 'translateY(-10px)';
              // Wait for animation to complete before hiding
              setTimeout(() => {
                dropdown.style.display = 'none';
              }, 200);
            }
          }
        }}
      >
        <HStack spacing={2}>
          <Avatar 
            size="sm" 
            bg="rgba(255, 255, 255, 0.2)" 
            icon={<Icon as={FiUser} fontSize="1.2rem" color={iconColor} />} 
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.3)"
          />
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            fontWeight="medium"
            isTruncated
            display={{ base: "none", md: "block" }}
          >
            {user?._json?.sAMAccountName || user?.username || "dev_user"}
          </Text>
        </HStack>
      </Button>
      
      {/* Custom dropdown menu */}
      <Box
        id="user-dropdown"
        position="fixed" /* Changed from absolute to fixed */
        top="auto" /* Auto top position */
        right="auto" /* Auto right position */
        width="200px"
        bg={menuBg}
        boxShadow="xl"
        borderRadius="md"
        overflow="hidden"
        zIndex="9999"
        display="none"
        opacity="0"
        transform="translateY(-10px)"
        p={2}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Box 
          as="button"
          onClick={() => {
            const dropdown = document.getElementById('user-dropdown');
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              dropdown.style.display = 'none';
              navigate("/profile");
            }, 200);
          }}
          display="flex"
          alignItems="center"
          w="100%"
          px={3}
          py={2}
          borderRadius="md"
          bg={location.pathname === "/profile" ? activeItemBg : "transparent"}
          color={location.pathname === "/profile" ? activeItemColor : menuItemColor}
          _hover={{ bg: menuItemHoverBg }}
          transition="background 0.2s ease, color 0.2s ease"
        >
          <Icon as={FiUser} color={menuItemMutedColor} mr={2} />
          <Text fontSize="sm" fontWeight="medium">Profile</Text>
        </Box>
        
        <Box 
          as="button"
          onClick={() => {
            const dropdown = document.getElementById('user-dropdown');
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              dropdown.style.display = 'none';
              navigate("/settings");
            }, 200);
          }}
          display="flex"
          alignItems="center"
          w="100%"
          px={3}
          py={2}
          borderRadius="md"
          mb={1}
          bg={location.pathname === "/settings" ? activeItemBg : "transparent"}
          color={location.pathname === "/settings" ? activeItemColor : menuItemColor}
          _hover={{ bg: menuItemHoverBg }}
          transition="background 0.2s ease, color 0.2s ease"
        >
          <Icon as={FiSettings} color={menuItemMutedColor} mr={2} />
          <Text fontSize="sm" fontWeight="medium">Settings</Text>
        </Box>
        
        <Divider borderColor={useColorModeValue("gray.300", "gray.600")} my={2} />
        
        <Box 
          as="button"
          onClick={() => {
            const dropdown = document.getElementById('user-dropdown');
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              dropdown.style.display = 'none';
              handleLogout();
            }, 200);
          }}
          display="flex"
          alignItems="center"
          w="100%"
          px={3}
          py={2}
          borderRadius="md"
          color={menuItemColor}
          _hover={{ 
            bg: logoutHoverBg,
            color: logoutHoverColor
          }}
          transition="background 0.2s ease, color 0.2s ease"
        >
          <Icon as={FiLogOut} color={menuItemMutedColor} mr={2} />
          <Text fontSize="sm" fontWeight="medium">Logout</Text>
        </Box>
      </Box>
    </Box>
  );
}

export default NavbarUserMenu;