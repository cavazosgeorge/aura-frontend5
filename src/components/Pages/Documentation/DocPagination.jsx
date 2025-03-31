import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
    HStack, 
    Button, 
    Text, 
    Icon, 
    VStack, 
    Spacer, 
    LinkBox, 
    LinkOverlay, 
    useColorModeValue 
} from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const PaginationButton = ({ doc, type }) => {
    const bgColor = useColorModeValue('gray.50', 'gray.700');
    const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    if (!doc) return <Spacer />; // Render Spacer if no doc to keep alignment

    const isPrev = type === 'prev';
    const alignment = isPrev ? 'flex-start' : 'flex-end';
    const icon = isPrev ? FiArrowLeft : FiArrowRight;
    const label = isPrev ? 'Previous' : 'Next';

    return (
        <LinkBox as="article" flex="1" maxWidth="48%"> {/* Limit width */}
            <Button 
                as="div" // Use div to allow LinkOverlay to work
                variant="outline" 
                w="full" 
                h="auto" // Auto height based on content
                p={4} 
                borderColor={borderColor}
                bg={bgColor}
                _hover={{ bg: hoverBgColor, borderColor: useColorModeValue('gray.300', 'gray.500') }}
                justifyContent="space-between"
                alignItems="center"
                textAlign={isPrev ? 'left' : 'right'}
            >
                <HStack w="full" justify={alignment}>
                    {isPrev && <Icon as={icon} mr={2} />}
                    <VStack align={alignment} spacing={0}>
                        <Text fontSize="xs" color="gray.500">{label}</Text>
                        <LinkOverlay as={RouterLink} to={doc.path} fontWeight="medium">
                            {doc.name}
                        </LinkOverlay>
                    </VStack>
                    {!isPrev && <Icon as={icon} ml={2} />}
                </HStack>
            </Button>
        </LinkBox>
    );
};


const DocPagination = ({ prevDoc, nextDoc }) => {
    return (
        <HStack 
            mt={12} // Add margin top to separate from content 
            spacing={4} // Space between buttons
            width="full" 
            justify="space-between" // Ensure buttons are pushed to edges
        >
            <PaginationButton doc={prevDoc} type="prev" />
            <PaginationButton doc={nextDoc} type="next" />
        </HStack>
    );
};

export default DocPagination;