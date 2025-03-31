
import React, { memo } from "react";
import {
  Box,
  Text,
  VStack,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import { FiFileText } from "react-icons/fi";

/**
 * Empty state component for templates
 * Displayed when no templates are available
 * Uses React.memo to prevent unnecessary re-renders
 */
const EmptyTemplateState = ({ borderColor }) => {
  const textColor = useColorModeValue("gray.500", "gray.400");
  const iconColor = useColorModeValue("gray.300", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="md"
      borderColor={borderColor}
      bg={bgColor}
    >
      <VStack spacing={3}>
        <Icon as={FiFileText} boxSize={10} color={iconColor} />
        <Text color={textColor} textAlign="center">
          No templates available. Create a template to save frequently used access combinations.
        </Text>
      </VStack>
    </Box>
  );
};

export default memo(EmptyTemplateState);
