import React from "react";
import { Box, Heading, IconButton, useColorMode } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={colorMode === "light" ? "gray.100" : "gray.900"} py={4} display="flex" justifyContent="space-between" alignItems="center" px={4}>
      <Heading as="h1" size="xl">
        GPT-engineer Prompt Bank
      </Heading>
      <IconButton icon={colorMode === "light" ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" aria-label="Toggle color mode" />
    </Box>
  );
};

export default Navbar;
