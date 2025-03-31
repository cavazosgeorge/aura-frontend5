import React from 'react';
import { 
    Box, 
    VStack, 
    Heading, 
    Link as ChakraLink, 
    useColorModeValue, 
    Accordion, 
    AccordionItem, 
    AccordionButton, 
    AccordionPanel, 
    AccordionIcon,
    Badge 
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Define the structure for the sidebar with groups
const sidebarStructure = [
    {
        name: 'Welcome',
        type: 'group',
        children: [
            { name: 'Introduction', path: '/docs/welcome' }, // Renamed for clarity within group
            { name: 'Getting Started', path: '/docs/getting-started' },
            // { name: 'FAQ', path: '/docs/faq' }, // Future FAQ link
        ]
    },
    {
        name: 'Developers',
        type: 'group',
        children: [
            { name: 'API Reference', path: '/docs/api-reference' },
            { name: 'Technology Stack', path: '/docs/technology-stack' },
            { name: 'Architecture Overview', path: '/docs/architecture-overview' }, // Added new link
        ]
    },
    // Add more top-level links or groups here
    // Add a top-level link for Release Notes
    { name: 'Release Notes', path: '/docs/release-notes', type: 'link' },
    // Example:
    // { name: 'Guides', path: '/docs/guides', type: 'link' },
    // {
    //     name: 'Advanced',
    //     type: 'group',
    //     children: [
    //         { name: 'Advanced Feature 1', path: '/docs/adv-feature-1' },
    //     ]
    // },
];

const DocsSidebar = ({ hasNewReleaseNotes }) => { // Receive prop
    const location = useLocation();
    const headingColor = useColorModeValue('gray.800', 'whiteAlpha.900');
    const linkHoverBg = useColorModeValue('gray.100', 'gray.700');
    const activeLinkBg = useColorModeValue('blue.100', 'blue.800');
    const activeLinkColor = useColorModeValue('blue.800', 'blue.100');
    const inactiveLinkColor = useColorModeValue('gray.700', 'gray.200');
    const accordionButtonColor = useColorModeValue('gray.700', 'gray.200');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Calculate the initial index based on the current location path
    const calculateInitialIndex = () => {
        const index = sidebarStructure.findIndex(item => 
            item.type === 'group' && item.children.some(child => location.pathname === child.path)
        );
        return index >= 0 ? [index] : []; // Return as array for Accordion index
    };

    // State to manage open accordion indices
    const [openIndices, setOpenIndices] = React.useState(calculateInitialIndex);

    // Effect to update open indices when route changes (e.g., via pagination)
    React.useEffect(() => {
        setOpenIndices(calculateInitialIndex());
    }, [location.pathname]); // Re-run when the path changes

    const renderLink = (topic, isNested = false) => {
        const isActive = location.pathname === topic.path;
        return (
            <ChakraLink 
                key={topic.path}
                as={RouterLink} 
                to={topic.path} 
                display="block"
                py={1.5} // Adjusted padding
                px={isNested ? 6 : 3} // Indent nested links
                borderRadius="md"
                _hover={{ 
                    textDecoration: 'none',
                    bg: linkHoverBg,
                }}
                bg={isActive ? activeLinkBg : 'transparent'}
                fontWeight={isActive ? 'bold' : 'normal'}
                color={isActive ? activeLinkColor : inactiveLinkColor}
                fontSize="sm" // Consistent font size
            >
                {topic.name}
            </ChakraLink>
        );
    };

    return (
        <Box 
            as="nav" 
            p={5} 
            borderRight="1px" 
            borderColor={borderColor} 
            w="full" 
            h="full"
        >
            <Heading size="sm" mb={4} textTransform="uppercase" color={headingColor}>
                Documentation
            </Heading>
            {/* Make Accordion controlled using the index prop AND handle clicks with onChange */}
            <Accordion 
                allowToggle 
                index={openIndices} 
                onChange={setOpenIndices} // Update state on user click/toggle
            >
                <VStack align="stretch" spacing={1}>
                    {sidebarStructure.map((item, index) => {
                        if (item.type === 'link') {
                            // Directly render link here to easily add the badge
                            return (
                                <ChakraLink
                                    key={item.path}
                                    as={RouterLink}
                                    to={item.path}
                                    display="flex" // Use flex to align text and badge
                                    alignItems="center" // Center items vertically
                                    justifyContent="space-between" // Push badge to the right
                                    py={1.5}
                                    px={3} // No extra indent for top-level links
                                    borderRadius="md"
                                    _hover={{ 
                                        textDecoration: 'none',
                                        bg: linkHoverBg,
                                    }}
                                    bg={location.pathname === item.path ? activeLinkBg : 'transparent'}
                                    fontWeight={location.pathname === item.path ? 'bold' : 'normal'}
                                    color={location.pathname === item.path ? activeLinkColor : inactiveLinkColor}
                                    fontSize="sm"
                                >
                                    {item.name}
                                    {/* Conditionally render the badge */}
                                    {item.path === '/docs/release-notes' && hasNewReleaseNotes && (
                                        <Badge colorScheme="blue" variant="solid" fontSize="0.6em" ml={2}>
                                            NEW
                                        </Badge>
                                    )}
                                </ChakraLink>
                            );
                        } else if (item.type === 'group') {
                            return (
                                <AccordionItem key={item.name} border="none">
                                    <h2>
                                        <AccordionButton 
                                            py={1.5}
                                            px={3}
                                            borderRadius="md"
                                            _hover={{ bg: linkHoverBg }}
                                            justifyContent="space-between" // Align icon to the right
                                        >
                                            <Box 
                                                flex="1" 
                                                textAlign="left" 
                                                fontWeight="medium" 
                                                fontSize="md" // Increased font size for group titles
                                                color={accordionButtonColor} // Apply color here
                                            > 
                                                {item.name}
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={2} pt={1} px={0}> {/* Adjust padding */}
                                        <VStack align="stretch" spacing={1}>
                                            {item.children.map(child => renderLink(child, true))}
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            );
                        }
                        return null;
                    })}
                </VStack>
            </Accordion>
        </Box>
    );
};

export default DocsSidebar;