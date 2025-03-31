import React from "react";
import { Box, Text, HStack, Link, Tooltip } from "@chakra-ui/react";

const PaginationControls = ({
  currentPage,
  itemsPerPage,
  totalItems,
  setCurrentPage,
  setItemsPerPage,
  indexOfFirstItem,
  indexOfLastItem,
  handleNextPage,
  handleShowAll,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      mb="1rem"
      gap="1rem"
    >
      {/* <Text>
        Showing {indexOfFirstItem + 1} -{" "}
        {currentPage === Math.ceil(totalItems / itemsPerPage)
          ? totalItems
          : indexOfLastItem}{" "}
        <Tooltip label={`${totalItems} records`} placement="top">
          <Link textDecoration="underline" cursor="pointer" ml={2} mr={0}>
            Total Count
          </Link>
        </Tooltip>
      </Text> */}

      <Text>
        Showing {indexOfFirstItem + 1} -{" "}
        {currentPage === Math.ceil(totalItems / itemsPerPage)
          ? totalItems
          : indexOfLastItem}{" "}
        <Tooltip label={`${totalItems} records`} placement="top">
          <Link
            textDecoration="underline"
            cursor="pointer"
            ml={2}
            mr={0}
            onClick={handleShowAll}
          >
            Total Count
          </Link>
        </Tooltip>
      </Text>

      <HStack spacing={4}>
        <Link
          as="span"
          ml={-1}
          onClick={
            currentPage === 1 ? null : () => setCurrentPage(currentPage - 1)
          }
          _hover={{
            color: currentPage === 1 ? null : "#001F30",
          }}
          cursor={currentPage === 1 ? "default" : "pointer"}
          color={currentPage == 1 ? "gray.400" : "#005078"}
          isTruncated
        >
          {"< prev"}
        </Link>

        <Text as="span" mx={0} color="gray.800">
          {`Page ${currentPage}`}
        </Text>
        <Link
          ml={0}
          as="span"
          onClick={
            currentPage === Math.ceil(totalItems / itemsPerPage)
              ? null
              : handleNextPage // Use the handleNextPage prop
          }
          _hover={{
            color:
              currentPage === Math.ceil(totalItems / itemsPerPage)
                ? null
                : "#001F30",
          }}
          cursor={
            currentPage === Math.ceil(totalItems / itemsPerPage)
              ? "default"
              : "pointer"
          }
          color={
            currentPage === Math.ceil(totalItems / itemsPerPage)
              ? "gray.400"
              : "#005078"
          }
          isTruncated
        >
          {"next >"}
        </Link>
      </HStack>

      <HStack spacing={2}>
        <Link
          onClick={totalItems >= 25 ? () => setItemsPerPage(25) : null}
          _hover={{
            color: totalItems >= 25 ? "#001F30" : null,
          }}
          cursor={totalItems >= 25 ? "pointer" : "default"}
          color={totalItems >= 25 ? "#005078" : "gray.400"}
        >
          25
        </Link>
        <Link
          onClick={totalItems >= 50 ? () => setItemsPerPage(50) : null}
          _hover={{
            color: totalItems >= 50 ? "#001F30" : null,
          }}
          cursor={totalItems >= 50 ? "pointer" : "default"}
          color={totalItems >= 50 ? "#005078" : "gray.400"}
        >
          50
        </Link>
        <Link
          onClick={totalItems >= 75 ? () => setItemsPerPage(75) : null}
          _hover={{
            color: totalItems >= 75 ? "#001F30" : null,
          }}
          cursor={totalItems >= 75 ? "pointer" : "default"}
          color={totalItems >= 75 ? "#005078" : "gray.400"}
        >
          75
        </Link>
        <Link
          onClick={totalItems >= 100 ? () => setItemsPerPage(100) : null}
          _hover={{
            color: totalItems >= 100 ? "#001F30" : null,
          }}
          cursor={totalItems >= 100 ? "pointer" : "default"}
          color={totalItems >= 100 ? "#005078" : "gray.400"}
        >
          100
        </Link>
      </HStack>
    </Box>
  );
};

export default PaginationControls;
