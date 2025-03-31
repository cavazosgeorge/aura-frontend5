// import React, { useState } from 'react';
// import {
//   Card,
//   VStack,
//   HStack,
//   Heading,
//   Text,
//   Button,
//   Select,
//   FormControl,
//   FormLabel,
//   useColorModeValue,
//   useToast
// } from "@chakra-ui/react";
// import { FaKey, FaExchangeAlt } from "react-icons/fa";

// const PasswordManagement = ({ formatDate }) => {
//   const [selectedSystem, setSelectedSystem] = useState("");
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const toast = useToast();
  
//   // Color mode variables for consistent styling
//   const textColor = useColorModeValue("gray.800", "gray.100");
//   const mutedTextColor = useColorModeValue("gray.600", "gray.400");
//   const selectBg = useColorModeValue("white", "gray.700");
  
//   // Mock data for available systems
//   const availableSystems = [
//     { id: "ccms", name: "CCMS" },
//     { id: "kzopa", name: "KZOPA Domain" },
//     { id: "legacy_apn", name: "Legacy APN" },
//   ];
  
//   // Password last changed dates (would come from API in real implementation)
//   const passwordLastChanged = {
//     kzopa: "2025-03-10",
//     legacy_apn: "2025-02-15",
//     ccms: "2025-04-01",
//     historian: "2025-01-20"
//   };
  
//   const handleSystemChange = (e) => {
//     setSelectedSystem(e.target.value);
//   };
  
//   const handleChangePassword = () => {
//     if (!selectedSystem) {
//       toast({
//         title: "System required",
//         description: "Please select a system to change password for",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
    
//     // Mock implementation - would trigger password change flow in real app
//     setIsChangingPassword(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setIsChangingPassword(false);
//       toast({
//         title: "Password change initiated",
//         description: `Password change process started for ${availableSystems.find(s => s.id === selectedSystem)?.name}`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     }, 1500);
//   };

//   return (
//     <Card variant="outline" p={4}>
//       <VStack align="start" spacing={4}>
//         <HStack>
//           <FaKey color={useColorModeValue("blue.500", "blue.300")} />
//           <Heading size="xs" color={textColor}>Password Management</Heading>
//         </HStack>
        
//         <Text color={mutedTextColor}>
//           You can change your password for any of the systems you have access to.
//         </Text>
        
//         <FormControl>
//           <FormLabel fontSize="sm" fontWeight="medium">Select System</FormLabel>
//           <Select
//             placeholder="Choose a system"
//             value={selectedSystem}
//             onChange={handleSystemChange}
//             bg={selectBg}
//             size="md"
//           >
//             {availableSystems.map(system => (
//               <option key={system.id} value={system.id}>
//                 {system.name}
//               </option>
//             ))}
//           </Select>
//         </FormControl>
        
//         {selectedSystem && (
//           <Text fontSize="sm" color={mutedTextColor}>
//             Password for {availableSystems.find(s => s.id === selectedSystem)?.name} was last changed on {passwordLastChanged[selectedSystem] ? formatDate(passwordLastChanged[selectedSystem]) : "N/A"}.
//           </Text>
//         )}
        
//         <Button 
//           leftIcon={<FaExchangeAlt />}
//           mt={2} 
//           colorScheme="blue" 
//           size="sm"
//           isDisabled={!selectedSystem}
//           isLoading={isChangingPassword}
//           loadingText="Initiating..."
//           onClick={handleChangePassword}
//         >
//           Change Password
//         </Button>
//       </VStack>
//     </Card>
//   );
// };

// export default PasswordManagement;



import React, { useState } from 'react';
import {
  Card,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Select,
  FormControl,
  FormLabel,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { FaKey, FaExchangeAlt } from "react-icons/fa";

const PasswordManagement = ({ formatDate }) => {
  const [selectedSystem, setSelectedSystem] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const toast = useToast();
  
  // Color mode variables for consistent styling
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const selectBg = useColorModeValue("white", "gray.700");
  
  // Mock data for available systems
  const availableSystems = [
    { id: "ccms", name: "CCMS" },
    { id: "kzopa", name: "KZOPA Domain" },
    { id: "legacy_apn", name: "Legacy APN" },
  ];
  
  // Password last changed dates (would come from API in real implementation)
  const passwordLastChanged = {
    kzopa: "2025-03-10",
    legacy_apn: "2025-02-15",
    ccms: "2025-04-01",
    historian: "2025-01-20"
  };
  
  const handleSystemChange = (e) => {
    setSelectedSystem(e.target.value);
  };
  
  const handleChangePassword = () => {
    if (!selectedSystem) {
      toast({
        title: "System required",
        description: "Please select a system to change password for",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Mock implementation - would trigger password change flow in real app
    setIsChangingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      toast({
        title: "Password change initiated",
        description: `Password change process started for ${availableSystems.find(s => s.id === selectedSystem)?.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };

  return (
    <Card variant="outline" p={4}>
      <VStack align="start" spacing={4}>
        <HStack>
          <FaKey color={useColorModeValue("blue.500", "blue.300")} />
          <Heading size="xs" color={textColor}>Password Management</Heading>
        </HStack>
        
        <Text color={mutedTextColor}>
          You can change your password for any of the systems you have access to.
        </Text>
        
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">Select System</FormLabel>
          <Select
            placeholder="Choose a system"
            value={selectedSystem}
            onChange={handleSystemChange}
            bg={selectBg}
            size="md"
          >
            {availableSystems.map(system => (
              <option key={system.id} value={system.id}>
                {system.name}
              </option>
            ))}
          </Select>
        </FormControl>
        
        {selectedSystem && (
          <Text fontSize="sm" color={mutedTextColor}>
            Password for {availableSystems.find(s => s.id === selectedSystem)?.name} was last changed on {passwordLastChanged[selectedSystem] ? formatDate(passwordLastChanged[selectedSystem]) : "N/A"}.
          </Text>
        )}
        
        <Button 
          leftIcon={<FaExchangeAlt />}
          mt={2} 
          colorScheme="blue" 
          size="sm"
          isDisabled={!selectedSystem}
          isLoading={isChangingPassword}
          loadingText="Initiating..."
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
      </VStack>
    </Card>
  );
};

export default PasswordManagement;