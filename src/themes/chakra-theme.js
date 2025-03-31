import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { checkboxTheme } from "./customCheckboxTheme";
import { tagTheme } from "./tagTheme";

// Define our brand colors
const colors = {
  brand: {
    50: "#E6F6FF",
    100: "#CCE8FF",
    200: "#99D1FF",
    300: "#66BAFF",
    400: "#3394FF",
    500: "#0070F3", // Primary brand color
    600: "#005CC4",
    700: "#004896",
    800: "#003367",
    900: "#001F3F",
  },
  // Override Chakra blue with our brand blue
  blue: {
    50: "#E6F6FF",
    100: "#CCE8FF",
    200: "#99D1FF",
    300: "#66BAFF",
    400: "#3394FF",
    500: "#0070F3",
    600: "#005CC4",
    700: "#004896",
    800: "#003367",
    900: "#001F3F",
  },
  // Dark mode specific colors
  darkMode: {
    bg: "#121212",
    card: "#1E1E1E",
    hover: "#2D2D2D",
    border: "#333333",
    text: "#E0E0E0",
    muted: "#A0A0A0",
  },
};

// Define semantic tokens for consistent theming
const semanticTokens = {
  colors: {
    "bg.primary": {
      default: "white",
      _dark: colors.darkMode.bg,
    },
    "bg.secondary": {
      default: "gray.50",
      _dark: colors.darkMode.card,
    },
    "bg.card": {
      default: "white",
      _dark: colors.darkMode.card,
    },
    "bg.hover": {
      default: "gray.100",
      _dark: colors.darkMode.hover,
    },
    "border.subtle": {
      default: "gray.200",
      _dark: colors.darkMode.border,
    },
    "text.primary": {
      default: "gray.800",
      _dark: colors.darkMode.text,
    },
    "text.secondary": {
      default: "gray.600",
      _dark: colors.darkMode.muted,
    },
  },
};

// Define global styles that apply to all components
const styles = {
  global: (props) => ({
    body: {
      bg: mode("white", colors.darkMode.bg)(props),
      color: mode("gray.800", colors.darkMode.text)(props),
    },
  }),
};

// Component-specific style overrides
const components = {
  Checkbox: checkboxTheme,
  Tag: tagTheme,
  Button: {
    baseStyle: {
      fontWeight: "500",
      borderRadius: "md",
    },
  },
  Card: {
    baseStyle: (props) => ({
      container: {
        bg: mode("white", colors.darkMode.card)(props),
        borderColor: mode("gray.200", colors.darkMode.border)(props),
      },
    }),
  },
  Tabs: {
    variants: {
      enclosed: (props) => ({
        tab: {
          _selected: {
            bg: mode("white", colors.darkMode.card)(props),
            color: mode("gray.800", colors.darkMode.text)(props),
            borderColor: mode("gray.200", colors.darkMode.border)(props),
            borderBottomColor: mode("white", colors.darkMode.card)(props),
          },
        },
        tablist: {
          borderColor: mode("gray.200", colors.darkMode.border)(props),
        },
        tabpanel: {
          bg: mode("white", colors.darkMode.card)(props),
        },
      }),
    },
  },
  Table: {
    variants: {
      simple: (props) => ({
        th: {
          borderColor: mode("gray.200", colors.darkMode.border)(props),
          color: mode("gray.600", colors.darkMode.muted)(props),
        },
        td: {
          borderColor: mode("gray.200", colors.darkMode.border)(props),
        },
      }),
    },
  },
  Input: {
    variants: {
      outline: (props) => ({
        field: {
          borderColor: mode("gray.200", colors.darkMode.border)(props),
          _hover: {
            borderColor: mode("gray.300", "gray.500")(props),
          },
          _focus: {
            borderColor: mode("blue.500", "blue.300")(props),
          },
        },
      }),
    },
  },
};

// Create the extended theme
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  fonts: {
    body: "'Noto Sans', sans-serif",
    heading: "'Noto Sans', sans-serif",
  },
  colors,
  semanticTokens,
  styles,
  components,
});

export default theme;