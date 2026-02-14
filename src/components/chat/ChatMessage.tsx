import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  const userBg = useColorModeValue("blue.500", "blue.400");
  const assistantBg = useColorModeValue("gray.100", "gray.700");
  const errorBg = useColorModeValue("red.50", "red.900");
  const assistantColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} w="100%">
      <Box
        maxW={{ base: "85%", md: "70%" }}
        bg={isError ? errorBg : isUser ? userBg : assistantBg}
        color={isError ? "red.600" : isUser ? "white" : assistantColor}
        borderRadius="2xl"
        borderBottomRightRadius={isUser ? "sm" : "2xl"}
        borderBottomLeftRadius={isUser ? "2xl" : "sm"}
        px={4}
        py={3}
        boxShadow="sm"
        position="relative"
      >
        <Text
          fontSize="sm"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          lineHeight="1.6"
        >
          {message.content}
        </Text>
        <Text
          fontSize="xs"
          opacity={0.6}
          mt={1}
          textAlign={isUser ? "right" : "left"}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Box>
    </Flex>
  );
}

export default ChatMessageBubble;
