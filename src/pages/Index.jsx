import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Heading, Text, VStack, HStack, Card, CardHeader, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, useDisclosure, useToast, IconButton, Flex, CheckboxGroup, Stack, Checkbox, Tag, Image } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { FaPlus, FaEdit, FaThumbtack, FaChevronUp, FaChevronDown, FaCopy } from "react-icons/fa";

const API_URL = "https://superb-harmony-3876e2c3fe.strapiapp.com/api/prompts?populate=*";

const Index = () => {
  const [prompts, setPrompts] = useState([]);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [testedModels, setTestedModels] = useState([]);
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
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          name,
          prompt,
          prerequisites,
          pinned: false,
          testedModels,
        }),
      );
      if (previewImage) {
        formData.append("files.preview", previewImage);
      }
      const response = await fetch("https://superb-harmony-3876e2c3fe.strapiapp.com/api/prompts", {
        method: "POST",
        body: formData,
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
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          name,
          prompt,
          prerequisites,
          pinned: editingPrompt.attributes.pinned,
          testedModels,
        }),
      );
      if (previewImage) {
        formData.append("files.preview", previewImage);
      }
      const response = await fetch(`https://superb-harmony-3876e2c3fe.strapiapp.com/api/prompts/${editingPrompt.id}?populate=*`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      setPrompts(prompts.map((p) => (p.id === editingPrompt.id ? data.data : p)));
      setPreviewImage(null);
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

  const openEditModal = (prompt) => {
    setEditingPrompt(prompt);
    setName(prompt.attributes.name);
    setPrompt(prompt.attributes.prompt);
    setPrerequisites(prompt.attributes.prerequisites || "");
    setTestedModels(prompt.attributes.testedModels || []);
    onOpen();
  };

  const togglePin = async (prompt) => {
    try {
      const response = await fetch(`https://superb-harmony-3876e2c3fe.strapiapp.com/api/prompts/${prompt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            pinned: !prompt.attributes.pinned,
          },
        }),
      });
      const data = await response.json();
      setPrompts(prompts.map((p) => (p.id === prompt.id ? data.data : p)));
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const [expandedPrompt, setExpandedPrompt] = useState(null);

  const location = useLocation();
  const isEditable = new URLSearchParams(location.search).get("editable") === "true";

  return (
    <Box>
      <Navbar />
      <Header />
      <Box p={4}>
        {isEditable && (
          <Box display="flex" justifyContent="flex-end" mb={4}>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              onClick={() => {
                setEditingPrompt(null);
                setName("");
                setPrompt("");
                onOpen();
              }}
            >
              New Prompt
            </Button>
          </Box>
        )}
        <VStack spacing={4} align="stretch">
          {[...prompts]
            .sort((a, b) => (a.attributes.pinned === b.attributes.pinned ? 0 : a.attributes.pinned ? -1 : 1))
            .map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md">{prompt.attributes.name}</Heading>
                    <HStack>
                      <IconButton icon={expandedPrompt === prompt.id ? <FaChevronUp /> : <FaChevronDown />} size="sm" onClick={() => setExpandedPrompt(expandedPrompt === prompt.id ? null : prompt.id)} aria-label={expandedPrompt === prompt.id ? "Hide Details" : "Show Details"} />
                      {isEditable && (
                        <>
                          <IconButton icon={<FaEdit />} size="sm" onClick={() => openEditModal(prompt)} aria-label="Edit Prompt" />
                          <IconButton icon={<FaThumbtack />} size="sm" onClick={() => togglePin(prompt)} colorScheme={prompt.attributes.pinned ? "blue" : "gray"} aria-label="Pin Prompt" />
                        </>
                      )}
                    </HStack>
                  </Flex>
                </CardHeader>
                <CardBody>
                  {expandedPrompt === prompt.id && (
                    <>
                      {prompt.attributes.prerequisites && (
                        <Box mb={4}>
                          <Heading size="md" mb={2}>
                            Prerequisites
                          </Heading>
                          <Text whiteSpace="pre-wrap">{prompt.attributes.prerequisites}</Text>
                        </Box>
                      )}
                      {prompt.attributes.testedModels && prompt.attributes.testedModels.length > 0 && (
                        <Box mb={4}>
                          <Heading size="md" mb={2}>
                            Tested Models
                          </Heading>
                          <HStack>
                            {prompt.attributes.testedModels.map((model) => (
                              <Tag key={model}>{model}</Tag>
                            ))}
                          </HStack>
                        </Box>
                      )}
                      <Heading size="md" mb={2}>
                        Prompt
                      </Heading>
                      <Box position="relative" borderWidth={1} borderRadius="md" p={2}>
                        <IconButton
                          icon={<FaCopy />}
                          size="sm"
                          position="absolute"
                          top={2}
                          right={2}
                          onClick={() => {
                            navigator.clipboard.writeText(prompt.attributes.prompt);
                            toast({
                              title: "Copied to clipboard",
                              status: "success",
                              duration: 2000,
                              isClosable: true,
                            });
                          }}
                          aria-label="Copy to Clipboard"
                        />
                        <Text whiteSpace="pre-wrap" fontFamily="monospace">
                          {prompt.attributes.prompt}
                        </Text>
                      </Box>
                      {prompt.attributes.preview?.data?.attributes?.url && (
                        <Box mt={4}>
                          <Heading size="md" mb={2}>
                            Preview
                          </Heading>
                          <Image src={prompt.attributes.preview.data.attributes.url} alt="Preview" />
                        </Box>
                      )}
                    </>
                  )}
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
              <FormControl mb={4}>
                <FormLabel>Prompt</FormLabel>
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt" />
              </FormControl>
              <FormControl>
                <FormLabel>Prerequisites</FormLabel>
                <Textarea value={prerequisites} onChange={(e) => setPrerequisites(e.target.value)} placeholder="Enter prerequisites" />
              </FormControl>
              <FormControl>
                <FormLabel>Preview Image</FormLabel>
                <Input type="file" accept="image/*" onChange={(e) => setPreviewImage(e.target.files[0])} />
              </FormControl>
              <FormControl>
                <FormLabel>Tested Models</FormLabel>
                <CheckboxGroup value={testedModels} onChange={setTestedModels}>
                  <Stack spacing={2}>
                    <Checkbox value="claude-3-opus-20240229">claude-3-opus-20240229</Checkbox>
                    <Checkbox value="claude-3-haiku-20240307">claude-3-haiku-20240307</Checkbox>
                    <Checkbox value="gpt-4-1106-preview">gpt-4-1106-preview</Checkbox>
                    <Checkbox value="gpt-3.5-turbo">gpt-3.5-turbo</Checkbox>
                  </Stack>
                </CheckboxGroup>
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
    </Box>
  );
};

export default Index;
