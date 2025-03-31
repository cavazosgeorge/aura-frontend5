import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Tooltip, Icon, Box } from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

/**
 * ColorModeToggle component
 * 
 * A button that toggles between light and dark mode with a sun/moon icon
 * 
 * @param {Object} props - Component props
 * @param {Object} props.iconProps - Props to be passed to the Icon component
 * @param {Object} props.buttonProps - Props to be passed to the Box button component
 * @returns {JSX.Element} Rendered ColorModeToggle component
 */
const ColorModeToggle = ({ iconProps = {}, buttonProps = {} }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = colorMode === 'light' ? FiMoon : FiSun;
  const tooltipLabel = colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  
  // Use our semantic tokens for consistent styling
  const iconColor = useColorModeValue('white', 'yellow.200');
  const bgColor = useColorModeValue('transparent', 'transparent');
  const hoverBgColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200');
  
  return (
    <Tooltip label={tooltipLabel} placement="bottom" hasArrow>
      <Box
        as="button"
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
        onClick={toggleColorMode}
        borderRadius="full"
        p={2}
        bg={bgColor}
        color={iconColor}
        _hover={{ bg: hoverBgColor }}
        transition="all 0.2s"
        display="flex"
        alignItems="center"
        justifyContent="center"
        {...buttonProps}
      >
        <Icon 
          as={SwitchIcon} 
          boxSize="20px" 
          {...iconProps} 
        />
      </Box>
    </Tooltip>
  );
};

export default ColorModeToggle;