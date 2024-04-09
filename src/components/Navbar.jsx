import React from "react";
import { Box, Heading } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box bg="gray.100" py={4}>
      <Heading as="h1" size="xl" textAlign="center">
        GPT-engineer Prompt Bank
      </Heading>
    </Box>
  );
};

export default Navbar;
