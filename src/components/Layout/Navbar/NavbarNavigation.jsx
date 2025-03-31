import React from "react";
import {
  HStack,
  Button,
  useColorModeValue
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

function NavbarNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation items
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    // { name: "About", path: "/about-us" }
  ];
  
  return (
    <HStack spacing={2} alignItems="center">
      {navItems.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          size="sm"
          color="white"
          fontWeight="normal"
          _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
          _active={{ bg: "rgba(255, 255, 255, 0.3)" }}
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </Button>
      ))}
    </HStack>
  );
}

export default NavbarNavigation;