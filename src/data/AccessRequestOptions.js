import { useColorMode } from "@chakra-ui/react";

export const sampleData = [
  {
    name: "George Cavazos",
    workArea: "Automation",
    equipment: ["Infrastructure"],
    role: ["Admins", "Cisco Enable", "Password Admins"],
    userId: "CAVAZG01",
  },
    {
      name: "John Doe",
      workArea: "Engineering",
      equipment: ["Laptop"],
      role: ["Developer", "Admin"],
      userId: "JOHNDOE01",
    },
    {
      name: "Jane Doe",
      workArea: "HR",
      equipment: ["Laptop"],
      role: ["Manager"],
      userId: "JANEDOE01",
    },
]

export const departmentOptions = [
  { value: "Department 1", label: "Department 1" },
  { value: "Department 2", label: "Department 2" },
];

export const equipmentOptions = [
  { value: "Equipment 1", label: "Equipment 1" },
  { value: "Equipment 2", label: "Equipment 2" },
];

export const rolesOptions = [
  { value: "Supervisor", label: "Supervisor" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Operator_1", label: "Operator 1" },
  { value: "Engineer_1", label: "Engineer 1" },
];

export function useCustomColorStyles() {
  const { colorMode } = useColorMode();

  const customColorStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: colorMode === "dark" ? "gray.700" : "white",
      color: colorMode === "dark" ? "white" : "black",
      borderColor: colorMode === "dark" ? "gray.700" : "gray.300",
      "&:hover": {
        borderColor: colorMode === "dark" ? "gray.700" : "gray.300",
      },
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: colorMode === "dark" ? "gray.700" : "white",
      color: colorMode === "dark" ? "white" : "black",
    }),
    menuList: (provided, state) => ({
      ...provided,
      backgroundColor: colorMode === "dark" ? "gray.700" : "white",
      color: colorMode === "dark" ? "white" : "black",
    }),
    option: (provided, { isFocused }) => ({
      ...provided,
      backgroundColor: isFocused
        ? colorMode === "dark"
          ? "gray.600"
          : "gray.200"
        : null,
      color: colorMode === "dark" ? "white" : "black",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: colorMode === "dark" ? "gray.700" : "gray.300",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "black",
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "black",
      "&:hover": {
        backgroundColor: colorMode === "dark" ? "gray.600" : "gray.200",
        color: colorMode === "dark" ? "white" : "black",
      },
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "black",
      "&:hover": {
        color: "red",
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "black",
      "&:hover": {
        color: "lime",
      },
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "gray.700",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "black",
    }),
    input: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "black",
    }),
    loadingIndicator: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "black",
    }),
    groupHeading: (provided, state) => ({
      ...provided,
      color: colorMode === "dark" ? "white" : "black",
      backgroundColor: colorMode === "dark" ? "gray.700" : "gray.200",
    }),
    group: (provided, state) => ({
      ...provided,
      borderBottom:
        colorMode === "dark" ? "1px solid gray.700" : "1px solid gray.200",
    }),
  };

  return customColorStyles;
}
