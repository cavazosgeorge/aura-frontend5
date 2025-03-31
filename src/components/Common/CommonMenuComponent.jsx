import React, { useEffect, useRef } from "react";
import {
  VStack,
  Box,
  Text,
  Flex,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

const MenuComponent = ({
  data,
  selectedUsers,
  onSelectUser,
  displayField,
  value,
  fontSize,
  onClose,
  minSearchLength = 4,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose(); // Call onclose when clicking outside the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <VStack
      ref={menuRef}
      spacing={0}
      mt={2}
      border="1px solid"
      borderColor={useColorModeValue("gray.300", "gray.700")}
      borderRadius="md"
      w="100%"
      maxH="200px"
      overflowY="auto"
      boxShadow="md"
      bg={useColorModeValue("white", "gray.800")}
      fontSize={fontSize}
    >
      {value.length < minSearchLength ? (
        <Box p={2}>
          <Text>Please type {minSearchLength - value.length} more character{minSearchLength - value.length !== 1 ? 's' : ''}</Text>
        </Box>
      ) : data.length === 0 ? (
        <Box p={2}>
          <Text>No users found</Text>
        </Box>
      ) : (
        <>
          {Array.isArray(data) &&
            data
              .filter((user) => user.name && user.displayName) // Ensure both name and sAMAccountName are defined
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name using localeCompare
              .map((user, index, array) => (
                <Box
                  key={user.sAMAccountName} // Use sAMAccountName as the unique key
                  w="100%"
                  p={2}
                  borderRadius="md"
                  _hover={{
                    bg: useColorModeValue("gray.100", "gray.700"),
                    cursor: "pointer",
                  }}
                  bg={
                    selectedUsers.some(
                      (u) => u[displayField] === user[displayField],
                    )
                      ? "transparent"
                      : "transparent"
                  }
                  onClick={() => onSelectUser(user)}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    m={1}
                  >
                    <Box w="50%" pr={2}>
                      <Text fontWeight="bold">Name</Text>
                      <Text>{user.name}</Text> {/* Display user's name */}
                    </Box>
                    <Box w="50%" pl={2}>
                      <Text fontWeight="bold">UserID</Text>
                      <Text>{user.sAMAccountName}</Text>{" "}
                      {/* Display user's sAMAccountName */}
                    </Box>
                  </Flex>
                  {index !== array.length - 1 && (
                    <Divider borderColor="gray.300" />
                  )}
                </Box>
              ))}
        </>
      )}
    </VStack>
  );
};

export default MenuComponent;



// New design
// import React, { useEffect, useRef } from "react";
// import {
//   VStack,
//   Box,
//   Text,
//   Flex,
//   useColorModeValue,
//   Avatar,
//   Badge,
//   Icon,
//   Divider,
// } from "@chakra-ui/react";
// import { FaUser, FaCheck } from "react-icons/fa";

// const MenuComponent = ({
//   data,
//   selectedUsers,
//   onSelectUser,
//   displayField,
//   value,
//   fontSize,
//   onClose,
// }) => {
//   const menuRef = useRef(null);
  
//   // Color mode variables for consistent styling
//   const cardBg = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
//   const highlightColor = useColorModeValue("blue.50", "blue.900");
//   const textColor = useColorModeValue("gray.800", "gray.100");
//   const mutedTextColor = useColorModeValue("gray.600", "gray.400");
//   const hoverBg = useColorModeValue("gray.50", "gray.700");
//   const avatarBg = useColorModeValue("blue.500", "blue.400");

//   // Function to get initials from a name, handling NSA accounts
//   const getInitials = (name) => {
//     if (!name) return "?";
    
//     // Remove (NSA) from the name before processing
//     const cleanName = name.replace(/\s*\(NSA\)\s*/, " ").trim();
    
//     const names = cleanName.split(" ").filter(n => n.length > 0);
//     if (names.length === 0) return "?";
//     if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
//     return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         onClose(); // Call onclose when clicking outside the menu
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);
  
//   return (
//     <VStack
//       ref={menuRef}
//       spacing={0}
//       mt={2}
//       border="1px solid"
//       borderColor={borderColor}
//       borderRadius="md"
//       w="100%"
//       maxH="300px"
//       overflowY="auto"
//       boxShadow="md"
//       bg={cardBg}
//       fontSize={fontSize}
//       p={0}
//       zIndex={10}
//     >
//       {value.length < 4 ? (
//         <Box p={2}>
//           <Text color={mutedTextColor}>Please type {4 - value.length} more character{4 - value.length !== 1 ? 's' : ''}</Text>
//         </Box>
//       ) : data.length === 0 ? (
//         <Box p={4} textAlign="center">
//           <Text color={mutedTextColor}>No users found</Text>
//         </Box>
//       ) : (
//         <>
//           {Array.isArray(data) &&
//             data
//               .filter((user) => user.name || user.displayName)
//               .sort((a, b) => (a.name || a.displayName).localeCompare(b.name || b.displayName))
//               .map((user, index, array) => {
//                 const isSelected = selectedUsers.some(
//                   (u) => u[displayField] === user[displayField]
//                 );
//                 const userName = user.name || user.displayName || "";
                
//                 return (
//                   <Box
//                     key={user.sAMAccountName || index}
//                     w="100%"
//                     p={3}
//                     bg={isSelected ? highlightColor : "transparent"}
//                     _hover={{
//                       bg: isSelected ? highlightColor : hoverBg,
//                       cursor: "pointer",
//                     }}
//                     onClick={() => onSelectUser(user)}
//                     transition="background-color 0.2s"
//                   >
//                     <Flex align="center">
//                       <Avatar 
//                         size="sm" 
//                         bg={avatarBg}
//                         color="white"
//                         icon={<FaUser fontSize="0.8rem" />}
//                         mr={3}
//                         name={userName}
//                         getInitials={() => getInitials(userName)}
//                       />
                      
//                       <Box flex="1">
//                         <Text color={textColor}>{userName}</Text>
//                         <Text fontSize="sm" color={mutedTextColor}>{user.sAMAccountName || user.userId || ""}</Text>
//                       </Box>
                      
//                       {isSelected && (
//                         <Badge 
//                           colorScheme="green" 
//                           variant="subtle"
//                           ml={2}
//                           display="flex"
//                           alignItems="center"
//                         >
//                           <Icon as={FaCheck} mr={1} fontSize="xs" />
//                         </Badge>
//                       )}
//                     </Flex>
                    
//                     {index !== array.length - 1 && (
//                       <Divider borderColor={borderColor} mt={3} />
//                     )}
//                   </Box>
//                 );
//               })}
//         </>
//       )}
//     </VStack>
//   );
// };

// export default MenuComponent;