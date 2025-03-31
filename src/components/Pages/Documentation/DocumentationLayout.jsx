import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Grid, GridItem, Box } from '@chakra-ui/react';
import DocsSidebar from './DocsSidebar';

// Key for local storage
const LOCAL_STORAGE_KEY = 'auraLastSeenReleaseNotesDate';

// Regex to find the first date like YYYY-MM-DD in a release heading
const dateRegex = /##\s*\[.*?\]\s*-\s*(\d{4}-\d{2}-\d{2})/;

const DocumentationLayout = () => {
    // Assuming Navbar height is 60px
    const navbarHeight = '60px'; 

    const location = useLocation(); // Need location here too
    const [latestReleaseDate, setLatestReleaseDate] = useState(null);
    const [hasNewReleaseNotes, setHasNewReleaseNotes] = useState(false);

    // Effect 1: Fetch notes, compare dates, set initial badge state
    useEffect(() => {
        const fetchAndCompareNotes = async () => {
            try {
                // Dynamically import the raw markdown content
                // Note: Vite requires the path to be relative or absolute from root
                const notesModule = await import('../../../docs/release-notes.md?raw');
                const notesContent = notesModule.default;
                const match = notesContent.match(dateRegex);

                if (match && match[1]) {
                    const currentLatestDate = match[1];
                    setLatestReleaseDate(currentLatestDate);

                    const lastSeenDate = localStorage.getItem(LOCAL_STORAGE_KEY);

                    if (currentLatestDate !== lastSeenDate) {
                        setHasNewReleaseNotes(true);
                    } else {
                        setHasNewReleaseNotes(false);
                    }
                }
            } catch (error) {
                console.error("Failed to load or parse release notes:", error);
                setHasNewReleaseNotes(false); // Default to no badge on error
            }
        };
        fetchAndCompareNotes();
    }, []); // Run once on mount

    // Effect 2: Update local storage and hide badge when notes are viewed
    useEffect(() => {
        if (location.pathname === '/docs/release-notes' && latestReleaseDate) {
            localStorage.setItem(LOCAL_STORAGE_KEY, latestReleaseDate);
            setHasNewReleaseNotes(false); // Hide badge immediately
        }
    }, [location.pathname, latestReleaseDate]); // Re-run if path or latest date changes

    return (
        <Grid 
            templateAreas={`"nav main"`}
            templateColumns="250px 1fr" // Sidebar width and remaining space for content
            // Set explicit height for the grid container below the navbar - REMOVED
            gap={0} // No gap between sidebar and content
        >
            <GridItem area={'nav'} as="aside" overflowY="auto"> 
                {/* Sidebar will be placed here, it should fill this container */}
                <DocsSidebar hasNewReleaseNotes={hasNewReleaseNotes} />
            </GridItem>
            {/* Main Content Area */}
            <GridItem area={'main'} as="main" 
                overflowY="auto" // Ensure main content scrolls independently
                py={5} // Vertical padding (top and bottom)
                px={24} // Adjusted horizontal padding
                textAlign="left"
            > 
                {/* The specific documentation page will render here */}
                <Outlet />
            </GridItem>
        </Grid>
    );
};

export default DocumentationLayout;