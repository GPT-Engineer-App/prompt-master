import React, { useState, useEffect } from "react";
import { Box, Button, Heading, Text, VStack, HStack, Card, CardHeader, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, useDisclosure, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://superb-harmony-3876e2c3fe.strapiapp.com/api/prompts";

const Index = () => {
  const [prompts, setPrompts] = useState([]);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPrompts(data.data);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  const createPrompt = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
            prompt,
          },
        }),
      });
      const data = await response.json();
      setPrompts([...prompts, data.data]);
      setName("");
      setPrompt("");
      onClose();
      toast({
        title: "Prompt created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating prompt:", error);
    }
  };

  const updatePrompt = async () => {
    try {
      const response = await fetch(`${API_URL}/${editingPrompt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
            prompt,
          },
        }),
      });
      const data = await response.json();
      setPrompts(prompts.map((p) => (p.id === editingPrompt.id ? data.data : p)));
      setEditingPrompt(null);
      setName("");
      setPrompt("");
      onClose();
      toast({
        title: "Prompt updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const deletePrompt = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      setPrompts(prompts.filter((p) => p.id !== id));
      toast({
        title: "Prompt deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  const openEditModal = (prompt) => {
    setEditingPrompt(prompt);
    setName(prompt.attributes.name);
    setPrompt(prompt.attributes.prompt);
    onOpen();
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Prompt Manager
      </Heading>
      <Button
        leftIcon={<FaPlus />}
        colorScheme="blue"
        mb={4}
        onClick={() => {
          setEditingPrompt(null);
          setName("");
          setPrompt("");
          onOpen();
        }}
      >
        New Prompt
      </Button>
      <VStack spacing={4} align="stretch">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader>
              <Heading size="md">{prompt.attributes.name}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{prompt.attributes.prompt}</Text>
              <HStack mt={4}>
                <Button leftIcon={<FaEdit />} size="sm" onClick={() => openEditModal(prompt)}>
                  Edit
                </Button>
                <Button leftIcon={<FaTrash />} size="sm" colorScheme="red" onClick={() => deletePrompt(prompt.id)}>
                  Delete
                </Button>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingPrompt ? "Edit Prompt" : "Create Prompt"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter prompt name" />
            </FormControl>
            <FormControl>
              <FormLabel>Prompt</FormLabel>
              <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={editingPrompt ? updatePrompt : createPrompt}>
              {editingPrompt ? "Update" : "Create"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
