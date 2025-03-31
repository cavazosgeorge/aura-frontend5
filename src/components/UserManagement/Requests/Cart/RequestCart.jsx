
import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  useToast,
  useColorModeValue,
  Card,
  CardBody
} from '@chakra-ui/react';
import { FiTrash2, FiShoppingCart, FiUserX } from 'react-icons/fi';
import useRequestsStore from '../../../../stores/requestsStore';

/**
 * Optimized RequestCart component
 * Uses React.memo, useCallback, and useMemo to prevent unnecessary re-renders
 * 
 * @param {Object} props Component props
 * @param {Array} props.cartItems Items in the cart
 * @param {Function} props.onRemoveItem Callback to remove an item from the cart
 * @param {Function} props.onClearCart Callback to clear the cart
 * @param {Function} props.onSubmit Callback to submit the cart
 */
const RequestCart = ({ 
  cartItems = [], 
  onRemoveItem = () => {}, 
  onClearCart = () => {}, 
  onSubmit = () => {} 
}) => {
  const toast = useToast();
  
  // Color mode values
  const tableBorderColor = useColorModeValue('gray.200', 'gray.600');
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700');
  const tableRowHoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Get the remove user function from the store
  const removeUserFromCart = useRequestsStore(state => state.removeUserFromCart);
  
  // Group cart items by user for better organization
  const groupedCartItems = useMemo(() => {
    const grouped = {};
    
    cartItems.forEach(item => {
      if (!grouped[item.userId]) {
        grouped[item.userId] = {
          user: item.user,
          userId: item.userId,
          items: []
        };
      }
      
      grouped[item.userId].items.push(item);
    });
    
    return Object.values(grouped);
  }, [cartItems]);
  
  // Handle cart submission
  const handleSubmit = useCallback(() => {
    if (cartItems.length === 0) {
      toast({
        title: 'Empty cart',
        description: 'Please add items to your cart before submitting',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    onSubmit(cartItems);
    
    toast({
      title: 'Requests submitted',
      description: `Successfully submitted ${cartItems.length} request(s)`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Clear cart after successful submission
    onClearCart();
  }, [cartItems, onSubmit, onClearCart, toast]);
  
  // Handle removing an item from the cart
  const handleRemoveItem = useCallback((itemId) => {
    onRemoveItem(itemId);
    
    toast({
      title: 'Item removed',
      description: 'Request removed from cart',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  }, [onRemoveItem, toast]);
  
  // Handle clearing the cart
  const handleClearCart = useCallback(() => {
    if (cartItems.length === 0) return;
    
    onClearCart();
    
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from the cart',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  }, [cartItems.length, onClearCart, toast]);
  
  return (
    <Card variant="outline" borderColor={borderColor}>
      <CardBody>
        <HStack justify="space-between" mb={4}>
          <HStack>
            <FiShoppingCart />
            <Heading size="md">Request Cart</Heading>
          </HStack>
          {cartItems.length > 0 && (
            <HStack>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={handleSubmit}
              >
                Submit Requests
              </Button>
            </HStack>
          )}
        </HStack>
        
        {cartItems.length === 0 ? (
          <Box 
            py={10}
            textAlign="center"
          >
            <Box 
              fontSize="4xl" 
              color="gray.300" 
              mb={3}
              display="flex"
              justifyContent="center"
            >
              <FiShoppingCart />
            </Box>
            <Text color="gray.500">Your request cart is empty</Text>
            <Text fontSize="sm" color="gray.500">
              Add access requests using the form above
            </Text>
          </Box>
        ) : (
          <VStack spacing={6} align="stretch">
            {groupedCartItems.map(group => (
              <Box 
                key={group.userId} 
                borderWidth="1px" 
                borderRadius="md" 
                overflow="hidden"
              >
                <Box 
                  bg={tableHeaderBg} 
                  p={3} 
                  borderBottomWidth="1px"
                  borderBottomColor={tableBorderColor}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{group.user}</Text>
                    <IconButton 
                      icon={<FiUserX />} 
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      aria-label={`Remove all requests for ${group.user}`}
                      onClick={() => removeUserFromCart(group.userId)}
                    />
                  </HStack>
                </Box>
                
                <Table variant="simple" size="sm">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>System</Th>
                      <Th>Area</Th>
                      <Th>Role</Th>
                      <Th width="50px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {group.items.map(item => (
                      <Tr 
                        key={item.id}
                        _hover={{ bg: tableRowHoverBg }}
                      >
                        <Td>{item.system}</Td>
                        <Td>{item.area}</Td>
                        <Td>{item.role}</Td>
                        <Td>
                          <IconButton
                            aria-label="Remove item"
                            icon={<FiTrash2 />}
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            ))}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};

export default React.memo(RequestCart);
