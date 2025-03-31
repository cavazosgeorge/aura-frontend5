import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Spinner, 
    Text, 
    Heading, 
    Link, 
    UnorderedList, 
    OrderedList, 
    ListItem, 
    Code, 
    Divider, 
    Image, 
    Box,
    useColorModeValue // Import the hook
} from '@chakra-ui/react'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw'; // Re-add rehype-raw import
import DocPagination from './DocPagination'; // Import the pagination component

// Basic styles for the autolink headings
import './DocumentationPage.css';

// Adjust the path based on where you store your markdown files
// Using Vite's dynamic import feature with the `?raw` suffix to load the raw content
const docsModules = import.meta.glob('/src/docs/*.md', { as: 'raw' });

// Flattened list of documentation pages in order
const docsList = [
    { name: 'Introduction', path: '/docs/welcome' },
    { name: 'Getting Started', path: '/docs/getting-started' },
    { name: 'API Reference', path: '/docs/api-reference' },
    { name: 'Technology Stack', path: '/docs/technology-stack' },
    { name: 'Architecture Overview', path: '/docs/architecture-overview' },
    { name: 'Release Notes', path: '/docs/release-notes' }, // Add Release Notes here
];

const DocumentationPage = () => {
    const { docName } = useParams(); 
    const [markdown, setMarkdown] = useState('');
    const [loading, setLoading] = useState(true); // Keep track of loading state
    const [error, setError] = useState(null);     // Keep track of errors
    const [showSpinner, setShowSpinner] = useState(false); // State to control spinner visibility

    const [prevDoc, setPrevDoc] = useState(null); 
    const [nextDoc, setNextDoc] = useState(null); 

    useEffect(() => {
        const loadMarkdown = async () => {
            setLoading(true);
            setError(null);
            setShowSpinner(false); // Reset spinner visibility on new doc load
            if (!docName) {
                setError('Documentation name not specified in URL.');
                setLoading(false);
                return;
            }
            const path = `/src/docs/${docName}.md`;
            try {
                if (docsModules[path]) {
                    const content = await docsModules[path]();
                    setMarkdown(content);
                } else {
                    setError(`Documentation file not found: ${docName}.md`);
                }
            } catch (err) {
                console.error('Error loading markdown:', err);
                setError('Failed to load documentation.');
            } finally {
                setLoading(false);
            }
        };

        // Set a timer to show the spinner only if loading takes longer than 300ms
        const timer = setTimeout(() => {
            setShowSpinner(true);
        }, 300); // 300ms delay

        loadMarkdown();

        // Cleanup the timer when the component unmounts or docName changes
        return () => clearTimeout(timer);
    }, [docName]);

    useEffect(() => {
        // Standard pagination logic using the full docsList
        const currentPath = `/docs/${docName}`;
        const currentIndex = docsList.findIndex(doc => doc.path === currentPath);

        if (currentIndex !== -1) {
            // Set Previous: null if it's the first item, otherwise the item before it
            setPrevDoc(currentIndex > 0 ? docsList[currentIndex - 1] : null);
            // Set Next: null if it's the last item, otherwise the item after it
            setNextDoc(currentIndex < docsList.length - 1 ? docsList[currentIndex + 1] : null);
        } else {
            // If the current doc isn't found in docsList, clear pagination
            setPrevDoc(null);
            setNextDoc(null);
        }
    }, [docName]);

    if (loading) {
        // Only show spinner if the timer has elapsed
        return showSpinner ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <Spinner size="xl" />
            </Box>
        ) : null; // Render nothing initially to avoid flicker
    }

    if (error) {
        return <Text color="red.500">{error}</Text>;
    }

    // Map Markdown elements to Chakra UI components
    const markdownComponents = {
        h1: (props) => <Heading as="h1" size="xl" my={4} {...props} />,
        h2: (props) => <Heading as="h2" size="lg" my={4} {...props} />,
        h3: (props) => <Heading as="h3" size="md" mt={0} mb={3} {...props} />,
        h4: (props) => <Heading as="h4" size="sm" my={2} {...props} />,
        h5: (props) => <Heading as="h5" size="xs" my={2} {...props} />,
        h6: (props) => <Heading as="h6" size="xs" my={2} {...props} />,
        p: (props) => <Text my={4} {...props} />,
        a: (props) => <Link color="blue.500" isExternal {...props} />, // Assuming external links, adjust if needed
        ul: (props) => <UnorderedList my={4} spacing={2} {...props} />, 
        ol: (props) => <OrderedList my={4} spacing={2} {...props} />, 
        li: (props) => <ListItem {...props} />, 
        code: (props) => {
            const { children } = props;
            // Check if it's a block code (rendered inside <pre>) or inline
            // Note: This detection might need refinement depending on plugins
            const isBlock = props.node?.position?.start.line !== props.node?.position?.end.line;
            if (isBlock) {
                // For block code, we often handle it via the `pre` component, 
                // but provide a basic fallback
                return <Code display="block" p={2} borderRadius="md" my={4} {...props}>{children}</Code>;
            } 
            // Inline code
            const inlineCodeBg = useColorModeValue('gray.100', 'gray.700');
            // Use the same blue as the active sidebar link text color
            const inlineCodeColor = useColorModeValue('blue.800', 'blue.100'); 
            return <Code bg={inlineCodeBg} color={inlineCodeColor} px={1} py={0.5} borderRadius="md" fontSize="0.9em" {...props}>{children}</Code>;
        },
        pre: (props) => {
            // The actual code content is usually nested inside props.children.props.children
            // due to the structure react-markdown generates (<pre><code>...</code></pre>)
            const codeContent = props.children?.props?.children ?? '';
            const preBg = useColorModeValue('gray.50', 'gray.800'); // Different background for block vs inline
            const preColor = useColorModeValue('gray.800', 'gray.100');
            return (
                <Box as="pre" bg={preBg} p={4} borderRadius="md" my={4} overflowX="auto">
                    <Code bg="transparent" p={0} color={preColor}>{codeContent}</Code>
                </Box>
            );
        },
        blockquote: (props) => (
            <Box 
                as="blockquote" 
                borderLeft="4px" 
                borderColor="gray.300" 
                pl={4} 
                my={4} 
                fontStyle="italic"
                color="gray.600"
                {...props} 
            />
        ),
        hr: (props) => <Divider my={6} {...props} />,
        img: (props) => <Image my={4} {...props} />,
        // Add custom styling for the div wrapping the SVG
        div: ({ node, ...props }) => (
            <Box mb={0} maxWidth="1350px" mx="auto" {...props} />
        ),
        // Ensure images are responsive and don't overflow
    };

    return (
        <Box>
            {loading && showSpinner && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Spinner size="xl" />
                </Box>
            )}
            {error && (
                <Text color="red.500">{error}</Text>
            )}
            {!loading && !error && markdown && (
                <>
                    <ReactMarkdown 
                        components={markdownComponents} // Add the components prop
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[
                            rehypeSlug, // Add slug IDs to headings
                            // Configure rehype-autolink-headings
                            [rehypeAutolinkHeadings, { 
                                // Change behavior to prepend the link
                                behavior: 'prepend', 
                                properties: { 
                                    // Add a class to the link
                                    className: ['heading-anchor-link'] 
                                }, 
                                // Set the content of the link to '#'
                                content: { type: 'text', value: '#' } 
                            }],
                            rehypeRaw // Re-add rehype-raw to handle raw HTML/SVG
                        ]}
                    >
                        {markdown}
                    </ReactMarkdown>
                    {/* Add Pagination below the content */}
                    <DocPagination 
                        prevDoc={prevDoc} // Pass the state variable
                        nextDoc={nextDoc} // Pass the state variable
                    />
                </>
            )}
        </Box>
    );
};

export default DocumentationPage;