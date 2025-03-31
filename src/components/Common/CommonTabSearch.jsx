import React, { useRef, useEffect } from "react";
import {
  Box,
  InputGroup,
  Input,
  InputLeftElement,
  HStack,
  Tag,
  TagCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import MenuComponent from "../Common/CommonMenuComponent";

const CommonTabSearch = ({
  mt,
  mr, 
  ml,
  fontSize,
  placeholder,
  displayField = "sAMAccountName",
  searchQuery = "", // Add default empty string
  setSearchQuery,
  fetchedUsers = [], // Add default empty array
  isLoading = false, // Add default false
  isMenuOpen = false, // Add default false
  setMenuOpen,
  inputRef,
  onSelectUser,
  onDeselectUser,
  selectedUsers = [], // Add default empty array
  contextName = "global",
  minSearchLength = 4 // Default minimum search length
}) => {
  const containerRef = useRef(null);
  const localInputRef = useRef(null); // Create a local ref in case inputRef is undefined
  
  // Use actual inputRef if provided, otherwise use local ref
  const effectiveInputRef = inputRef || localInputRef;
  
  const handleInputChange = (e) => {
    if (setSearchQuery) {
      setSearchQuery(e.target.value);
    }
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (setMenuOpen) {
          setMenuOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuOpen]);
  
  return (
    <Box mt={2} ml={ml} mr={mr} mb={4}>
      {/* Only render tags if there are selectedUsers */}
      {selectedUsers && selectedUsers.length > 0 && (
        <HStack spacing={2} wrap="wrap">
          {selectedUsers.map((user) => (
            <Tag size="md" colorScheme="messenger" key={user.sAMAccountName || Math.random()}>
              {user.name || "Unknown"}
              <TagCloseButton onClick={() => onDeselectUser && onDeselectUser(user)} />
            </Tag>
          ))}
        </HStack>
      )}
      
      <InputGroup mt={2}>
        <InputLeftElement>
          <FiSearch />
        </InputLeftElement>
        <Input
          ref={effectiveInputRef}
          placeholder={placeholder || "Search..."}
          value={searchQuery}
          onChange={handleInputChange}
          data-context={contextName}
        />
      </InputGroup>
      
      {/* Only show spinner if isLoading is true */}
      {isLoading && (
        <Box mt={4} textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      )}
      
      {/* Only show menu if all necessary conditions are met */}
      {/* {!isLoading && searchQuery && searchQuery.length > 0 && fetchedUsers && fetchedUsers.length > 0 && (
        <Box ref={containerRef} mt={4}>
          <MenuComponent
            value={searchQuery}
            data={fetchedUsers}
            displayField={displayField}
            selectedUsers={selectedUsers || []}
            onSelectUser={onSelectUser} 
            fontSize={fontSize}
            onClose={() => setMenuOpen && setMenuOpen(false)}
          />
        </Box>
      )} */}
      {(!isLoading && searchQuery && searchQuery.length > 0 && isMenuOpen) && (
        <Box ref={containerRef} mt={4}>
          <MenuComponent
            value={searchQuery}
            data={fetchedUsers}
            displayField={displayField}
            selectedUsers={selectedUsers || []}
            onSelectUser={onSelectUser}
            fontSize={fontSize}
            onClose={() => setMenuOpen && setMenuOpen(false)}
            minSearchLength={minSearchLength}
          />
        </Box>
      )}
    </Box>
  );
};

export default CommonTabSearch;




// // New design
// import React, { useRef, useEffect } from "react";
// import {
//   Box,
//   InputGroup,
//   Input,
//   InputLeftElement,
//   HStack,
//   Tag,
//   TagCloseButton,
//   Spinner,
//   Avatar,
//   TagLeftIcon,
//   Flex,
//   useColorModeValue,
//   VisuallyHidden,
// } from "@chakra-ui/react";
// import { FiSearch, FiUser } from "react-icons/fi";
// import MenuComponent from "../Common/CommonMenuComponent";

// const CommonTabSearch = ({
//   mt,
//   mr, 
//   ml,
//   fontSize,
//   placeholder,
//   displayField = "sAMAccountName",
//   searchQuery = "", 
//   setSearchQuery,
//   fetchedUsers = [], 
//   isLoading = false, 
//   isMenuOpen = false, 
//   setMenuOpen,
//   inputRef,
//   onSelectUser,
//   onDeselectUser,
//   selectedUsers = [], 
//   contextName = "global",
//   onInputFocus,
// }) => {
//   const containerRef = useRef(null);
//   const localInputRef = useRef(null);
//   const effectiveInputRef = inputRef || localInputRef;
  
//   // Color theme variables
//   const avatarBg = useColorModeValue("blue.500", "blue.400");
//   const tagBg = useColorModeValue("blue.50", "blue.900");
//   const tagColor = useColorModeValue("blue.800", "blue.100");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
  
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
  
//   const handleInputChange = (e) => {
//     if (setSearchQuery) {
//       setSearchQuery(e.target.value);
//     }
//   };

//   const handleInputFocus = (e) => {
//     if (onInputFocus) {
//       onInputFocus(e);
//     }
    
//     // If there are search results and the menu isn't already open, open it
//     if (searchQuery && searchQuery.length >= 3 && fetchedUsers.length > 0 && !isMenuOpen && setMenuOpen) {
//       setMenuOpen(true);
//     }
//   };
  
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (containerRef.current && !containerRef.current.contains(event.target)) {
//         if (setMenuOpen) {
//           setMenuOpen(false);
//         }
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [setMenuOpen]);
  
//   return (
//     <Box mt={mt || 2} ml={ml} mr={mr} mb={4} position="relative">
//       <VisuallyHidden id={`${contextName}-search-label`}>
//         Search users
//       </VisuallyHidden>
      
//       {/* Selected user tags */}
//       {selectedUsers && selectedUsers.length > 0 && (
//         <Flex wrap="wrap" mb={2} gap={2}>
//           {selectedUsers.map((user) => (
//             <Tag 
//               size="md" 
//               key={user.sAMAccountName || Math.random()} 
//               borderRadius="full"
//               variant="subtle"
//               colorScheme="blue"
//               py={1}
//               px={2}
//             >
//               <Avatar 
//                 size="xs" 
//                 name={user.name || "Unknown"} 
//                 bg={avatarBg}
//                 color="white"
//                 mr={2}
//                 getInitials={() => getInitials(user.name || "Unknown")}
//               />
//               {user.name || "Unknown"}
//               <TagCloseButton 
//                 onClick={() => onDeselectUser && onDeselectUser(user)} 
//                 aria-label={`Remove ${user.name || "user"}`}
//               />
//             </Tag>
//           ))}
//         </Flex>
//       )}
      
//       {/* Search input */}
//       <InputGroup mt={selectedUsers && selectedUsers.length > 0 ? 2 : 0}>
//         <InputLeftElement pointerEvents="none">
//           <FiSearch color="gray.500" />
//         </InputLeftElement>
//         <Input
//           ref={effectiveInputRef}
//           placeholder={placeholder || "Search users..."}
//           value={searchQuery}
//           onChange={handleInputChange}
//           onFocus={handleInputFocus}
//           data-context={contextName}
//           aria-labelledby={`${contextName}-search-label`}
//           borderColor={borderColor}
//           _focus={{ 
//             borderColor: "blue.400", 
//             boxShadow: "0 0 0 1px blue.400"
//           }}
//         />
//       </InputGroup>
      
//       {/* Loading spinner */}
//       {isLoading && (
//         <Flex justify="center" mt={4} mb={2}>
//           <Spinner
//             thickness="4px"
//             speed="0.65s"
//             emptyColor="gray.200"
//             color="blue.500"
//             size="md"
//           />
//         </Flex>
//       )}
      
//       {/* User search results menu */}
//       {(!isLoading && searchQuery && searchQuery.length > 0 && isMenuOpen) && (
//         <Box 
//           ref={containerRef} 
//           position="relative"
//           zIndex="dropdown"
//           width="100%"
//         >
//           <MenuComponent
//             value={searchQuery}
//             data={fetchedUsers}
//             displayField={displayField}
//             selectedUsers={selectedUsers || []}
//             onSelectUser={onSelectUser} 
//             fontSize={fontSize}
//             onClose={() => setMenuOpen && setMenuOpen(false)}
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default CommonTabSearch;