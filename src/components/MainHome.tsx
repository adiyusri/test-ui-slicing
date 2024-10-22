"use client";

import {
  Avatar,
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  Skeleton,
  Textarea,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  AiOutlineComment,
  AiOutlineLike,
  AiOutlineRetweet,
} from "react-icons/ai";
import { PiTelegramLogo } from "react-icons/pi";
import ModalPost from "./ModalPost";

interface PostApi {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  mind: string;
  picture: string;
  status: number;
}

const MainHome = () => {
  const [posts, setPosts] = useState<PostApi[]>([]);
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null); // State for loading timeout
  const [ModalID, setModalID] = useState<number | null>(null); // Replaced any with number | null
  const toast = useToast({
    position: "top",
    variant: "subtle",
    duration: 3000,
  });
  const Modal = useDisclosure();
  const [countLike, setCountLike] = useState(0);

  const handleLike = () => {
    setCountLike((prev) => (prev === 0 ? 1 : prev - 1));
  };

  const handleModal = (id: number) => {
    setModalID(id);
    Modal.onOpen();
  };

  // Fetch posts and comments from the API
  const fetchData = async () => {
    setIsLoading(true); // Start loading
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/list/post`
      );
      setPosts(res.data.data || []);

    } catch (err) {
      console.error("Error fetching post", err);
      toast({
        title: "Error fetching posts",
        description: "Could not load posts. Please try again later.",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, [ModalID]); 


  const formik = useFormik({
    initialValues: {
      mind: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setIsLoading(true); // Start loading

      // Set a loading timeout for 5 seconds (5000 ms)
      const timeout = setTimeout(() => {
        setIsLoading(false); // Stop loading after 5 seconds
      }, 5000);
      setLoadingTimeout(timeout);

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/create/post`, values)
        .then((res) => {
          // Fetch the updated posts after successful post creation
          fetchData().finally(() => {
            clearTimeout(timeout); // Clear the timeout if the request completes before it fires
            setIsLoading(false); // Stop loading
            setLoadingTimeout(null);
          });
          setSubmitting(false);
          // Show success toast
          toast({
            description: "Your post has been successfully created!",
            status: "success",
            isClosable: true,
            duration: 2000,
          });
          // Optionally, you can reset the form after posting
          formik.resetForm();
        })
        .catch((err) => {
          console.error("Error creating post", err);
          setSubmitting(false);
          clearTimeout(timeout); // Clear the timeout on error
          setIsLoading(false); // Stop loading on error
          // Show error toast
          toast({
            title: "Error creating post.",
            description: "Could not create your post. Please try again.",
            status: "error",
            isClosable: true,
          });
        });
    },
  });

  return (
    <Box px={48} w={"100%"} pb={10}>
      <HStack spacing="24px" alignItems={"flex-start"}>
        <Box w="250px" h="300"  borderRadius="lg">
          <Box h="200px" bg="white" mb={4}></Box>
          <Box h='80px' bg="white"></Box>
        </Box>
        <Box w="700px" h="fit-content">
          <form onSubmit={formik.handleSubmit}>
            <Box
              bg={"white"}
              h={"fit-content"}
              padding={2}
              gap={2}
              borderWidth="1px"
              borderRadius="lg"
              mb={4}
            >
              <Flex gap={2} mt={2}>
                <Avatar bg="gray.500" />
                <Textarea
                  placeholder="Tulis komentar..."
                  value={formik.values.mind}  // Bind value to formik
                  onChange={formik.handleChange}  // Handle change with formik
                  name="mind"  // Name field to match formik initialValues
                />
              </Flex>
              <Box mt={2} display={"flex"} gap={2} justifyContent={"flex-end"}>
                <Button colorScheme="blue" h={8} w={20} type="submit">
                  Post
                </Button>
              </Box>
            </Box>
          </form>

          {/* Show skeleton loading while new post is being created */}
          {isLoading && <Skeleton height="100px" />}

          {posts
            .slice()
            .sort((a, b) => (a.ID < b.ID ? 1 : -1))
            .map((item) => (
              <Box
                key={item.ID}
                bg={"white"}
                h={"fit-content"}
                padding={2}
                gap={2}
                borderWidth="1px"
                borderRadius="lg"
                mb={4}
              >
                <Box display={"flex"} gap={2}>
                  <Avatar bg="gray.500" />
                  <Box display={"flex"} flexDir={"column"} justifyContent={"left"}>
                    <Text fontSize={"md"}>Gundala</Text>
                    <Text fontSize={"sm"}>Super Hero</Text>
                  </Box>
                </Box>
                <Text mt={2} ml={2}>
                  {item.mind}
                </Text>
                <SimpleGrid
                  columns={4}
                  spacing={10}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    height="40px"
                    display={"flex"}
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "gray.300" }}
                    as='button' onClick={handleLike}
                  >
                    <AiOutlineLike  color={countLike < 1 ? "" : "red"} />
                    <Text fontSize={"sm"}> {countLike < 1 ? "" : countLike} Like</Text>
                  </Box>
                  
                  <Box
                    height="40px"
                    display={"flex"}
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "gray.300" }}
                    as='button' onClick={() => handleModal(item.ID)}
                  >
                    <AiOutlineComment />
                    <Text fontSize={"sm"}>Comment</Text>
                  </Box>
                  <Box
                    height="40px"
                    display={"flex"}
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "gray.300" }}
                  >
                    <AiOutlineRetweet />
                    <Text fontSize={"sm"}>Share</Text>
                  </Box>
                  <Box
                    height="40px"
                    display={"flex"}
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "gray.300" }}
                  >
                    <PiTelegramLogo />
                    <Text fontSize={"sm"}>Kirim</Text>
                  </Box>
                </SimpleGrid>
                  <Box borderTop="1px solid" borderColor="gray.300" h={16} gap={2}  pl={2} display={"flex"} alignItems="center">
                  <Avatar bg="gray.500" w={6} h={6} />
                  <Box bg="white" w="full" h="10" borderRadius="lg" p={1} border="1px solid" borderColor="gray.300" as='button' onClick={() => handleModal(item.ID)} >   
                  </Box>
                </Box>
                
              </Box>
            ))}
        </Box>
        <Box w="300px" h="650" bg="white" borderRadius="lg">
        </Box>
      </HStack>

    <ModalPost isOpen={Modal.isOpen} onClose={Modal.onClose} activePost={ModalID} />

    </Box>
  );
};

export default MainHome;
