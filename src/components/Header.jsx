import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box p={8} textAlign="center">
      <Heading as="h2" size="xl" mb={4}>
        Prompt Bank
      </Heading>
      <Text fontSize="xl">This is a place to share reliable prompts that can serve as great starting points for your projects. Some prompts might have prerequisites, so keep that in mind when exploring and using them.</Text>
    </Box>
  );
};

export default Header;
