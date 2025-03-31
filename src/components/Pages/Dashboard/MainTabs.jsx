import React, { useEffect } from "react";
import { 
  Box, 
  Flex, 
  Text, 
  useColorModeValue,
  Tab, 
  Tabs, 
  TabList, 
  TabPanel, 
  TabPanels,
  Icon,
  HStack,
  Card,
  CardBody,
  Divider
} from "@chakra-ui/react";
import { 
  FiFileText, 
  FiCheckSquare, 
  FiSearch, 
  FiShield,
  FiHome 
} from "react-icons/fi";
import { Requests } from "../../UserManagement/Requests";
import Approvals from "../../UserManagement/Approvals/Approvals";
import LookupContainer from "../../UserManagement/Lookup/LookupContainer";
import Compliance from "../../UserManagement/Compliance/Compliance";
import DashboardWelcome from "./DashboardWelcome";
import useTabStore from "../../../stores/tabStore";
import useAuthStore from "../../../stores/authStore";
import LoginPage from "../../Pages/Login/LoginPage";

/**
 * MainTabs component serves as the primary navigation interface for the application
 * Displays tabbed navigation with icons and manages the active tab state
 * 
 * Features:
 * - Tab-based navigation with consistent styling
 * - Icon and text labels for improved usability
 * - Smooth transitions between tabs
 * - Context-based tab state management
 * 
 * @returns {JSX.Element} Rendered MainTabs component
 */
function MainTabs() {
  // Use Zustand store instead of Context
  const activeTab = useTabStore(state => state.activeTab);
  const setActiveTab = useTabStore(state => state.setActiveTab);
  
  // Get authentication state from Zustand store
  const user = useAuthStore(state => state.user);
  const isAuthenticated = !!user;
  
  // Use semantic tokens for consistent styling
  const cardBg = useColorModeValue("bg.card", "bg.card");
  const borderColor = useColorModeValue("border.subtle", "border.subtle");
  const textColor = useColorModeValue("text.primary", "text.primary");
  const mutedTextColor = useColorModeValue("text.secondary", "text.secondary");
  const tabActiveBg = useColorModeValue("bg.card", "bg.card");
  // const tabInactiveBg = useColorModeValue("bg.secondary", "bg.secondary");
  const tabInactiveBg = useColorModeValue("white", "bg.secondary");
  const iconColor = useColorModeValue("brand.500", "brand.300");
  const hoverBg = useColorModeValue("bg.hover", "bg.hover");
  
  // Tab data with icons and accent colors
  const tabs = [
    { 
      name: "Overview", 
      icon: FiHome,
      component: <DashboardWelcome />,
      color: "blue" // Default accent color
    },
    { 
      name: "Requests", 
      icon: FiFileText,
      component: isAuthenticated ? <Requests /> : <LoginPage />,
      color: "blue" // Default accent color
    },
    { 
      name: "Approvals", 
      icon: FiCheckSquare,
      component: isAuthenticated ? <Approvals /> : <LoginPage />,
      color: "blue" // Changed to blue accent color
    },
    // { 
    //   name: "Lookup", 
    //   icon: FiSearch,
    //   component: isAuthenticated ? <LookupContainer /> : <LoginPage />,
    //   color: "blue" // Changed to blue accent color
    // },
    // { 
    //   name: "Compliance", 
    //   icon: FiShield,
    //   component: isAuthenticated ? <Compliance /> : <LoginPage />,
    //   color: "blue" // Changed to blue accent color
    // }
  ];
  
  /**
   * Handles tab selection changes and updates the context
   * @param {number} index - The index of the selected tab
   */
  const handleTabChange = (index) => {
    setActiveTab(index);
  };
  
  // Set the active tab when the component mounts
  useEffect(() => {
    // Initialize the tab if not already set
    if (activeTab === undefined || activeTab === null) {
      setActiveTab(0);
    }
  }, [activeTab, setActiveTab]);
  
  return (
    <Box width="100%"> {/* Main container */}
      <Card 
        bg={cardBg}
        variant="outline" 
        borderColor={borderColor}
        boxShadow="sm"
        mb={6} // Increased bottom margin
        transition="all 0.2s"
        overflow="hidden"
      >
        <CardBody p={0}>
          <Tabs
            index={activeTab}
            onChange={handleTabChange}
            variant="enclosed"
            colorScheme="blue"
            size="md"
            width="100%"
          >
            {/* Tab navigation header */}
            <TabList borderBottomWidth="1px" borderBottomColor={borderColor}>
              {tabs.map((tab, index) => (
                <Tab 
                  key={index}
                  role="group" // Added for _groupHover to work
                  py={4} // Increased vertical padding for tabs 
                  px={8} // Increased horizontal padding for tabs
                  fontWeight="medium"
                  color={activeTab === index ? textColor : mutedTextColor}
                  bg={activeTab === index ? tabActiveBg : tabInactiveBg}
                  borderTopRadius="md"
                  borderBottomWidth={0}
                  borderWidth="1px"
                  borderColor={activeTab === index ? 
                    (tab.color ? `${tab.color}.400` : borderColor) : 
                    "transparent"
                  }
                  borderTopColor={activeTab === index && tab.color ? `${tab.color}.400` : undefined}
                  borderRightColor={activeTab === index && tab.color ? `${tab.color}.400` : undefined}
                  borderLeftColor={activeTab === index && tab.color ? `${tab.color}.400` : undefined}
                  borderBottomColor={activeTab === index ? "transparent" : borderColor}
                  marginBottom="-1px"
                  _selected={{ 
                    color: textColor,
                    bg: tabActiveBg,
                    borderColor: tab.color ? `${tab.color}.400` : borderColor,
                    borderBottomColor: "transparent",
                  }}
                  _hover={{ 
                    color: activeTab === index ? textColor : (tab.color ? `${tab.color}.500` : mutedTextColor),
                    bg: activeTab === index ? tabActiveBg : (tab.color ? useColorModeValue(`${tab.color}.50`, `${tab.color}.900`) : hoverBg),
                    borderColor: tab.color ? `${tab.color}.400` : (activeTab === index ? borderColor : "transparent"),
                    borderBottomColor: activeTab === index ? "transparent" : borderColor
                  }}
                  transition="all 0.2s"
                >
                  <HStack spacing={2}>
                    <Icon 
                      as={tab.icon} 
                      color={activeTab === index ? 
                        (tab.color ? `${tab.color}.500` : iconColor) : 
                        mutedTextColor
                      } 
                      transition="color 0.2s"
                      _groupHover={{ 
                        color: tab.color ? `${tab.color}.500` : undefined
                      }}
                    />
                    <Text>{tab.name}</Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>
            
            {/* Tab content panels */}
            <TabPanels>
              {tabs.map((tab, index) => (
                <TabPanel key={index} p={6} bg={tabActiveBg}> {/* Increased padding in tab panels */}
                  {tab.component}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  );
}

export default MainTabs;
