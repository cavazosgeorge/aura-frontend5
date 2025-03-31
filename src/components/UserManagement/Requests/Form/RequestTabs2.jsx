import React, { memo } from "react";
import {
  Box,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Icon,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { FiPlus, FiFileText } from "react-icons/fi";
import RequestAccessPanel from "./RequestAccessPanel";
import TemplatesPanel from "./TemplatesPanel";

/**
 * Tabs component for the Requests2 feature
 * Manages the tabs for Request Access and Templates
 * Uses React.memo to prevent unnecessary re-renders
 */
const RequestTabs2 = ({
  tabIndex,
  setTabIndex,
  formState,
  handleFormChange,
  handleAddToCart,
  showTemplateForm,
  setShowTemplateForm,
  templateName,
  setTemplateName,
  templateAccesses,
  setTemplateAccesses,
  handleAddAccess,
  handleSaveTemplate,
  templates,
  setFormState
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const tabActiveBg = useColorModeValue("white", "gray.800");
  const mutedTextColor = useColorModeValue("gray.500", "gray.300");

  return (
    <Card 
      mb={6}
      bg={cardBg}
      variant="outline" 
      borderColor={borderColor}
      boxShadow="sm"
      overflow="hidden"
    >
      <CardBody p={0}>
        <Tabs 
          variant="enclosed" 
          colorScheme="blue" 
          index={tabIndex} 
          onChange={setTabIndex}
          sx={{
            '.chakra-tabs__tabpanel': {
              bg: cardBg,
            },
            '.chakra-tabs__tab[data-selected]': {
              bg: tabActiveBg,
              borderBottomColor: tabActiveBg,
            }
          }}
        >
          <TabList px={4} pt={4}>
            <Tab 
              _selected={{ 
                borderColor: borderColor, 
                borderBottomColor: "transparent" 
              }}
            >
              <HStack spacing={2}>
                <Icon as={FiPlus} color={tabIndex === 0 ? "blue.500" : mutedTextColor} />
                <Text>Request Access</Text>
              </HStack>
            </Tab>
            <Tab 
              _selected={{ 
                borderColor: borderColor, 
                borderBottomColor: "transparent" 
              }}
            >
              <HStack spacing={2}>
                <Icon as={FiFileText} color={tabIndex === 1 ? "blue.500" : mutedTextColor} />
                <Text>Templates</Text>
              </HStack>
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Request Access Panel */}
            <TabPanel p={0}>
              <RequestAccessPanel
                formState={formState}
                handleFormChange={handleFormChange}
                handleAddToCart={handleAddToCart}
              />
            </TabPanel>
            
            {/* Templates Panel */}
            <TabPanel p={0}>
              <TemplatesPanel
                showTemplateForm={showTemplateForm}
                setShowTemplateForm={setShowTemplateForm}
                templateName={templateName}
                setTemplateName={setTemplateName}
                formState={formState}
                handleFormChange={handleFormChange}
                templateAccesses={templateAccesses}
                setTemplateAccesses={setTemplateAccesses}
                handleAddAccess={handleAddAccess}
                handleSaveTemplate={handleSaveTemplate}
                templates={templates}
                setFormState={setFormState}
                setTabIndex={setTabIndex}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default memo(RequestTabs2);