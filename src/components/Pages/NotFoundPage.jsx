
import React from 'react';
import { Box, Heading, Text, Button, Center, VStack, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFoundPage = () => {
    return (
        <Center minHeight="calc(100vh - 160px)"> 
            <VStack spacing={6} textAlign="center">
                <Icon as={FiAlertTriangle} w={16} h={16} color="red.500" /> 
                <Heading as="h1" size="2xl">
                    404 - Page Not Found
                </Heading>
                <Text fontSize="lg" color="gray.600">
                    Oops! The page you are looking for does not exist. It might have been moved or deleted.
                </Text>
                <Button 
                    as={RouterLink} 
                    to="/dashboard" 
                    colorScheme="blue"
                    size="lg"
                >
                    Go to Dashboard
                </Button>
            </VStack>
        </Center>
    );
};

export default NotFoundPage;
