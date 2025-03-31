import React, { useState } from "react";
import {
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  HStack,
  Icon,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { FiFolder, FiUsers } from "react-icons/fi";

const LookupTabs = ({ 
  handleTabChange, 
  children 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  
  // Handle tab change and update active tab
  const onTabChange = (index) => {
    setActiveTab(index);
    handleTabChange(index);
  };
  return (
    <Tabs variant="enclosed" onChange={onTabChange} colorScheme="blue">
      <TabList>
        <Tab>
          <HStack spacing={2}>
            <Icon 
              as={FiFolder} 
              color={activeTab === 0 ? "blue.500" : mutedTextColor}
            />
            <Text>Groups</Text>
          </HStack>
        </Tab>
        <Tab>
          <HStack spacing={2}>
            <Icon 
              as={FiUsers} 
              color={activeTab === 1 ? "blue.500" : mutedTextColor}
            />
            <Text>Users</Text>
          </HStack>
        </Tab>
      </TabList>

      <TabPanels mt={4}>
        {children}
      </TabPanels>
    </Tabs>
  );
};

export default LookupTabs;