import Image from "next/image";
import styles from "./page.module.css";
import { div } from "framer-motion/client";
import Navbar from "@/components/Navbar";
import { Box } from "@chakra-ui/react";
import MainHome from "@/components/MainHome";

export default function Home() {
  return (
    <Box h="fit-content" bg="#F4F2EE">
      <Box position="sticky" top={0} zIndex={1}>
        <Navbar />
      </Box>
      <br />
      <MainHome />
    </Box>

  );
}
