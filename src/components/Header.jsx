import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box p={8} textAlign="center">
      <Heading as="h2" size="xl" mb={4}></Heading>
      <Text fontSize="xl">This site curates prompts that are great for getting high-quality initial generations to kick off your projects. Keep in mind that some prompts may have prerequisites or work best with certain models.</Text>
    </Box>
  );
};

export default Header;
