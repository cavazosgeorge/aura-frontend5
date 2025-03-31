import React from "react";
import { 
  SimpleGrid, 
  Card, 
  CardBody, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Icon, 
  Box, 
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import { 
  FiUsers, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiClock,
  FiActivity,
  FiInbox,
  FiCalendar,
  FiTrendingUp,
  FiRefreshCw
} from "react-icons/fi";

const StatsCards = ({ customStats, spacingSize = 6 }) => {
  // Color mode variables for consistent styling using semantic tokens
  const cardBg = useColorModeValue("white", "darkMode.card");
  const borderColor = useColorModeValue("gray.200", "darkMode.border");
  const mutedTextColor = useColorModeValue("gray.600", "darkMode.muted");
  const textColor = useColorModeValue("gray.800", "darkMode.text");
  
  // Define color modes for the icon backgrounds
  const getIconColors = (colorName) => {
    const colors = {
      blue: {
        bg: useColorModeValue(`blue.50`, `blue.900`),
        fg: useColorModeValue(`blue.500`, `blue.200`)
      },
      green: {
        bg: useColorModeValue(`green.50`, `green.900`),
        fg: useColorModeValue(`green.500`, `green.200`)
      },
      orange: {
        bg: useColorModeValue(`orange.50`, `orange.900`),
        fg: useColorModeValue(`orange.500`, `orange.200`)
      },
      red: {
        bg: useColorModeValue(`red.50`, `red.900`),
        fg: useColorModeValue(`red.500`, `red.200`)
      },
      purple: {
        bg: useColorModeValue(`purple.50`, `purple.900`),
        fg: useColorModeValue(`purple.500`, `purple.200`)
      },
      teal: {
        bg: useColorModeValue(`teal.50`, `teal.900`),
        fg: useColorModeValue(`teal.500`, `teal.200`)
      }
    };
    
    // Default to blue if the color is not found
    return colors[colorName] || colors.blue;
  };
  
  // Default dashboard stats if no custom stats are provided
  const defaultStats = [
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
  
  // Admin request-related stats
  const adminRequestStats = [
    { 
      label: "Pending Requests", 
      value: 28, 
      change: "8 high priority", 
      icon: FiInbox,
      color: "blue" 
    },
    { 
      label: "Processing Time", 
      value: "1.2d", 
      change: "↓ 14% from last month", 
      icon: FiClock,
      color: "orange" 
    },
    { 
      label: "Approval Rate", 
      value: "87%", 
      change: "+3% from last month", 
      icon: FiCheckCircle,
      color: "green" 
    },
    { 
      label: "Weekly Volume", 
      value: 124, 
      change: "↑ 8% from last week", 
      icon: FiActivity,
      color: "purple" 
    }
  ];
  
  // Additional admin request stats
  const moreAdminRequestStats = [
    { 
      label: "Avg. Response Time", 
      value: "4.5h", 
      change: "↓ 12% improvement", 
      icon: FiRefreshCw,
      color: "teal" 
    },
    { 
      label: "Requests Today", 
      value: 17, 
      change: "3 urgent priority", 
      icon: FiCalendar,
      color: "orange" 
    },
    { 
      label: "Monthly Trend", 
      value: "+15%", 
      change: "Increasing volume", 
      icon: FiTrendingUp,
      color: "blue" 
    },
    { 
      label: "Rejected", 
      value: 12, 
      change: "5% rejection rate", 
      icon: FiAlertCircle,
      color: "red" 
    }
  ];
  
  // Use custom stats if provided, otherwise use default stats
  // For admin dashboard, we'll use request-related stats by default
  const stats = customStats || adminRequestStats;

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={spacingSize} mb={6}>
      {stats.map((stat, index) => {
        const iconColors = getIconColors(stat.color);
        return (
          <Card 
            key={index} 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
            transition="all 0.3s"
            _hover={{ 
              transform: "translateY(-4px)", 
              boxShadow: "md",
              borderColor: useColorModeValue(`${stat.color}.200`, `${stat.color}.700`)
            }}
          >
            <CardBody>
              <Flex align="center">
                <Box
                  p={2}
                  borderRadius="md"
                  bg={iconColors.bg}
                  color={iconColors.fg}
                  mr={4}
                  boxShadow="sm"
                >
                  <Icon as={stat.icon} boxSize={6} />
                </Box>
                <Stat>
                  <StatLabel color={mutedTextColor}>{stat.label}</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color={textColor}>{stat.value}</StatNumber>
                  <StatHelpText mb={0} color={mutedTextColor}>{stat.change}</StatHelpText>
                </Stat>
              </Flex>
            </CardBody>
          </Card>
        );
      })}
    </SimpleGrid>
  );
};

export default StatsCards;