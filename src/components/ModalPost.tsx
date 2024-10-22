"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Text,
  Avatar,
  Box,
  Flex,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { PiTelegramLogo } from "react-icons/pi";

interface CommentApi {
  ID: number;
  fullname: string;
  job: string;
  sentence: string;
  CreatedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePost?: number | null; // Updated type to ensure it's a number or null
}

const ModalPost = ({ isOpen, onClose, activePost }: Props) => {
  const [comments, setComments] = useState<CommentApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast({
    position: "top",
    variant: "subtle",
    duration: 3000,
  });

  // Fetch post comments from the API
  const fetchComments = async () => {
    if (!activePost) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/list/comment/${activePost}`
      );
      setComments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching Comments:", err);
    }
  };

  useEffect(() => {
    if (activePost) {
      fetchComments();
    }
  }, [activePost]);

  const formik = useFormik({
    initialValues: {
      sentence: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      const finalData = {
        sentence: values.sentence,
        fullname: "Kevin",
        job: "Commentator",
        post: activePost,
      };
      setSubmitting(true);
      setIsLoading(true);

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/create/comment`, finalData)
        .then(() => {
          fetchComments().finally(() => {
            setIsLoading(false);
            setSubmitting(false);
          });
          toast({
            description: "Your comment has been successfully created!",
            status: "success",
            isClosable: true,
            duration: 2000,
          });
          formik.resetForm();
        })
        .catch((err) => {
          console.error("Error creating comment", err);
          setSubmitting(false);
          setIsLoading(false);
          toast({
            title: "Error creating comment.",
            description: "Could not create your comment. Please try again.",
            status: "error",
            isClosable: true,
          });
        });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Post Comment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Display the main post */}
          <Box
            border={"2px"}
            borderColor={"gray.200"}
            p={4}
            rounded={"xl"}
            shadow={"sm"}
          >
            <Box display={"flex"} gap={2}>
              <Avatar bg="gray.500" />
              <Box display={"flex"} flexDir={"column"} justifyContent={"left"}>
                <Text fontSize={"md"}>Gundala</Text>
                <Text fontSize={"sm"}>Super Hero</Text>
              </Box>
            </Box>
            <Text mt={4} ml={2} fontSize={"xl"}>
              {/* Replace with the actual post content */}
              {comments[0]?.sentence || "Post content here"}
            </Text>
          </Box>
          <br />

          {/* Map through comments */}
          {comments.map((comment: CommentApi) => (
            <Box
              key={comment.ID}
              h={24}
              gap={2}
              pl={2}
              display={"flex"}
              alignItems="center"
              mt={-4}
            >
              <Avatar bg="gray.500" w={6} h={6} />
              <Box
                bg="gray.300"
                w="full"
                h="fit-content"
                borderRadius="lg"
                p={1}
              >
                <Text fontSize={"sm"} as="b">
                  {comment.fullname} - <Text as="i">{comment.job}</Text>
                </Text>
                <Text fontSize={"sm"}>{comment.sentence}</Text>
              </Box>
            </Box>
          ))}

          {/* Comment submission form */}
          <Box mt={12}>
            <form onSubmit={formik.handleSubmit}>
              <Flex gap={2} mt={4}>
                <Avatar bg="gray.500" size={"sm"} />
                <Textarea
                  h={24}
                  placeholder="Tulis komentar..."
                  value={formik.values.sentence}
                  onChange={formik.handleChange}
                  name="sentence"
                />
              </Flex>
              <Box
                mt={2}
                mb={4}
                display={"flex"}
                gap={2}
                justifyContent={"flex-end"}
              >
                <Button
                  colorScheme="blue"
                  h={8}
                  w={20}
                  type="submit"
                  isLoading={formik.isSubmitting}
                >
                  Kirim
                </Button>
              </Box>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalPost;
