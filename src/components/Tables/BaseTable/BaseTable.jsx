// import React from "react";
// import {
//   Table,
//   Thead,
//   Tr,
//   Th,
//   Tbody,
//   Td,
//   Button,
//   Flex,
//   Text,
// } from "@chakra-ui/react";

// const thButtonStyles = {
//   color: "white",
//   size: "xs",
//   variant: "ghost",
//   bg: "rgba(255, 255, 255, 0.1)",
//   _hover: { bg: "rgba(255, 255, 255, 0.2)" },
//   _active: { bg: "rgba(255, 255, 255, 0.3)" },
// };

// const BaseTable = ({
//   columns,
//   data = [],
//   renderCell,
//   currentPage,
//   itemsPerPage,
//   totalItems,
//   onPageChange,
// }) => { 
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage + 1;
//   const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

//   console.log(`Rendering BaseTable with ${data.length} items for page ${currentPage}`);

//   return (
//     <>
//       <Table variant="striped" width="100%">
//         <Thead bg="blue.500">
//           <Tr>
//             {columns.map((col, index) => (
//               <Th key={index} color="white">
//                 <Button {...thButtonStyles}>{col.label}</Button>
//               </Th>
//             ))}
//           </Tr>
//         </Thead>
//         <Tbody>
//           {data.map((row, rowIndex) => (
//             <Tr key={rowIndex}>
//               {columns.map((col) => (
//                 <Td key={col.field}>
//                   {renderCell ? renderCell(row, col) : row[col.field]}
//                 </Td>
//               ))}
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>

//       {/* Pagination Controls */}
//       <Flex justify="space-between" align="center" mt={4}>
//         <Text>
//           Showing {startIndex} to {endIndex} of {totalItems} results
//         </Text>
//         <Flex align="center">
//           <Button
//             onClick={() => onPageChange(currentPage - 1)}
//             isDisabled={currentPage === 1}
//             mr={2}
//             colorScheme="blue"
//           >
//             Previous
//           </Button>
//           <Text>
//             Page {currentPage} of {totalPages}
//           </Text>
//           <Button
//             onClick={() => onPageChange(currentPage + 1)}
//             isDisabled={currentPage === totalPages}
//             ml={2}
//             colorScheme="blue"
//           >
//             Next
//           </Button>
//         </Flex>
//       </Flex>
//     </>
//   );
// };

// export default BaseTable;




import React from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";

const thButtonStyles = {
  color: "white",
  size: "xs",
  variant: "ghost",
  bg: "rgba(255, 255, 255, 0.1)",
  _hover: { bg: "rgba(255, 255, 255, 0.2)" },
  _active: { bg: "rgba(255, 255, 255, 0.3)" },
};

const BaseTable = ({
  columns,
  data = [],
  renderCell,
  renderRow,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => { 
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);
  console.log(`Rendering BaseTable with ${data.length} items for page ${currentPage}`);

  return (
    <>
      <Table variant="striped" width="100%">
        <Thead bg="blue.500">
          <Tr>
            {columns.map((col, index) => (
              <Th key={index} color="white">
                <Button {...thButtonStyles}>{col.label}</Button>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => 
            renderRow ? (
              renderRow(row, rowIndex)
            ) : (
              <Tr key={rowIndex}>
                {columns.map((col) => (
                  <Td key={col.field}>
                    {renderCell ? renderCell(row, col) : row[col.field]}
                  </Td>
                ))}
              </Tr>
            )
          )}
        </Tbody>
      </Table>
      {/* Pagination Controls */}
      <Flex justify="space-between" align="center" mt={4}>
        <Text>
          Showing {startIndex} to {endIndex} of {totalItems} results
        </Text>
        <Flex align="center">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            mr={2}
            colorScheme="blue"
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
            ml={2}
            colorScheme="blue"
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default BaseTable;