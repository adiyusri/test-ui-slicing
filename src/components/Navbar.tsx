import { Box, Flex, Image, Input } from "@chakra-ui/react";
import React from "react";

const Navbar = () => {
  return (
    <Box h={14} bg="white" px={48} py={2}>
      <Flex>
        <Box display={"flex"} gap={2}>
          <Image src="/icon.png" alt="logo" width={10} height={10} />
          <Input placeholder="Search" />
        </Box>
        <Box></Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
