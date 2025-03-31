import React from "react";
import {
  Box,
  Card,
  CardBody,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import CommonTabSelect from "../../../Common/CommonTabSelect";

/**
 * Component for selecting hierarchy levels in the group structure
 */
const HierarchySelector = ({
  selectedSystem,
  hierarchyChain,
  selectedValuesByLevel,
  handleChange,
  isHierarchyStableLoading,
  loadingLevel,
  hierarchyHasMoreMap,
  systemOptions,
  borderColor,
}) => {
  // Color mode variables
  const textColor = useColorModeValue("gray.800", "gray.100");

  // Render hierarchy levels based on selected system
  const renderHierarchyLevels = () => {
    if (!selectedSystem) return null;

    return hierarchyChain.map((options, index) => {
      const level = index + 1;
      const finalOptions = [...options];
      if (hierarchyHasMoreMap && hierarchyHasMoreMap[level]) {
        finalOptions.push({
          value: "LOAD_MORE",
          label: "Load More...",
        });
      }

      const selectedValueForLevel = selectedValuesByLevel[level] || "";
      const isThisLevelLoading =
        isHierarchyStableLoading && loadingLevel === level;

      return (
        <Box key={index} mb={4}>
          <Text mb={2} fontWeight="medium" color={textColor}>
            Level {level}
          </Text>
          <CommonTabSelect
            primaryOptions={finalOptions}
            primaryPlaceholder={`Select Level ${level}`}
            primaryValue={selectedValueForLevel}
            onPrimaryChange={(e) => handleChange(e, level)}
            isLoading={isThisLevelLoading}
          />
        </Box>
      );
    });
  };

  return (
    <Card 
      variant="outline" 
      mb={6} 
      borderColor={borderColor}
      boxShadow="none"
    >
      <CardBody>
        <VStack spacing={4} align="stretch">
          {/* System Select */}
          <Box>
            <Text mb={2} fontWeight="medium" color={textColor}>
              System
            </Text>
            <CommonTabSelect
              primaryOptions={systemOptions}
              primaryPlaceholder="Select System"
              primaryValue={selectedSystem}
              onPrimaryChange={(e) => handleChange(e, 0)}
              isLoading={isHierarchyStableLoading && loadingLevel === 0}
            />
          </Box>

          {/* Hierarchy Levels */}
          {renderHierarchyLevels()}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default HierarchySelector;