import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
  label: {
    fontFamily: 'mono',
  },
  control: {
    borderColor: 'gray.500',
    _unchecked: {
      bg: 'white',
      borderColor: 'red',
    },
  },
});

export const checkboxTheme = defineMultiStyleConfig({ baseStyle });
