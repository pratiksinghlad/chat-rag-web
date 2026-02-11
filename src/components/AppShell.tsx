import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const bg = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex h="100vh" flexDir="column" bg={bg} overflow="hidden">
      <Header />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <Box flex="1" overflowY="auto" p={{ base: 4, md: 6, lg: 8 }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

export default AppShell;
