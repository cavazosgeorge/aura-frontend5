import React from 'react';
import { Box, Select, Spinner } from '@chakra-ui/react';

/**
 * CommonTabSelect component provides a consistent multi-level select interface
 * Used across the application for hierarchical selection patterns
 * 
 * @param {Object[]} primaryOptions - Array of options for primary select
 * @param {Object[]} secondaryOptions - Array of options for secondary select (shown when primary is selected)
 * @param {Object[]} tertiaryOptions - Array of options for tertiary select (shown when secondary is selected)
 * @param {string} primaryPlaceholder - Placeholder text for primary select
 * @param {string} secondaryPlaceholder - Placeholder text for secondary select
 * @param {string} tertiaryPlaceholder - Placeholder text for tertiary select
 * @param {string} primaryValue - Selected value for primary select
 * @param {string} secondaryValue - Selected value for secondary select
 * @param {string} tertiaryValue - Selected value for tertiary select
 * @param {Function} onPrimaryChange - Handler for primary select change
 * @param {Function} onSecondaryChange - Handler for secondary select change
 * @param {Function} onTertiaryChange - Handler for tertiary select change
 * @param {boolean} isLoading - Whether the component is in loading state
 */
const CommonTabSelect = ({ 
  primaryOptions = [],
  secondaryOptions = [],
  tertiaryOptions = [],
  primaryPlaceholder,
  secondaryPlaceholder,
  tertiaryPlaceholder,
  primaryValue,
  secondaryValue,
  tertiaryValue,
  onPrimaryChange,
  onSecondaryChange,
  onTertiaryChange,
  isLoading
}) => {
  return (
    <Box mt={4} mb={4}>
      {/* Primary Select - Always visible if options exist */}
      {primaryOptions.length > 0 && (
        <Select
          placeholder={primaryPlaceholder}
          value={primaryValue}
          onChange={onPrimaryChange}
        >
          {primaryOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
      
      {/* Loading State */}
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          mt={4}
        />
      ) : (
        /* Secondary and Tertiary Selects - Conditionally visible */
        <>
          {/* Secondary Select - Visible when primary is selected */}
          {primaryValue && secondaryOptions.length > 0 && (
            <Select
              placeholder={secondaryPlaceholder}
              value={secondaryValue}
              onChange={onSecondaryChange}
              mt={4}
            >
              {secondaryOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
          
          {/* Tertiary Select - Visible when secondary is selected */}
          {secondaryValue && tertiaryOptions.length > 0 && (
            <Select
              placeholder={tertiaryPlaceholder}
              value={tertiaryValue}
              onChange={onTertiaryChange}
              mt={4}
            >
              {tertiaryOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </>
      )}
    </Box>
  );
};

export default CommonTabSelect;