import React from "react";
import {  Stack, Heading, Text, Container } from "@chakra-ui/react";

/**
 * CommonTabHeader component for displaying consistent section headers
 * Used across different tab panels and feature sections
 */
const CommonTabHeader = ({ title, description }) => (
  <Container>
    <Stack spacing="1">
      <Heading
        size={{ base: "md", md: "lg", lg: "md", xl: "lg" }}
        fontWeight="medium"
      >
        {title}
      </Heading>
      <Text mt={2} mb={4} whiteSpace="nowrap">{description}</Text>
    </Stack>
  </Container>
);

export default CommonTabHeader;