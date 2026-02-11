/**
 * Home Page
 *
 * The main page for authenticated users.
 * Displays user profile information including name, email, and avatar.
 */

import { Navigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import UserCard from "@/components/UserCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppShell from "@/components/AppShell";

export function Home() {
  const { user, isLoading, getUserProfile } = useAuth();

  // Chakra Color Mode values
  const primaryColor = "blue.600";

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="white"
      >
        <LoadingSpinner message="Loading your profile..." />
      </Box>
    );
  }

  // Redirect unauthenticated users to landing
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const profile = getUserProfile();

  return (
    <AppShell>
      <VStack spacing={8} align="stretch" maxW="container.lg" mx="auto">
        <Box textAlign="center" animation="fadeIn 0.5s ease-out">
          <Heading as="h1" size="xl" mb={2} color="gray.900">
            Welcome back
            {profile?.fullName && (
              <Text as="span" color={primaryColor}>
                , {profile.fullName.split(" ")[0]}
              </Text>
            )}
            ! 👋
          </Heading>
          <Text color="gray.600" fontSize="lg">
            You're successfully signed in. Here's your profile information.
          </Text>
        </Box>

        {/* User profile card */}
        {profile && <UserCard profile={profile} />}

        {/* Quick actions */}
        <Box>
          <Heading as="h2" size="md" mb={6} color="gray.700">
            Quick Actions
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <ActionCard
              icon={
                <path
                  fill="currentColor"
                  d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6 3.6z"
                />
              }
              title="Settings"
              badge="Coming Soon"
              isDisabled
            />

            <ActionCard
              icon={
                <path
                  fill="currentColor"
                  d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                />
              }
              title="Security"
              badge="Coming Soon"
              isDisabled
            />

            <ActionCard
              icon={
                <path
                  fill="currentColor"
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                />
              }
              title="Activity"
              badge="Coming Soon"
              isDisabled
            />
          </SimpleGrid>
        </Box>
      </VStack>
    </AppShell>
  );
}

// Helper component for action cards
function ActionCard({
  icon,
  title,
  badge,
  isDisabled,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  isDisabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      height="auto"
      p={6}
      display="flex"
      flexDirection="column"
      gap={4}
      isDisabled={isDisabled}
      _hover={{
        transform: isDisabled ? "none" : "translateY(-2px)",
        shadow: "md",
      }}
      transition="all 0.2s"
      borderColor="gray.200"
      bg="white"
      position="relative"
    >
      {badge && (
        <Box
          position="absolute"
          top={2}
          right={2}
          bg="orange.100"
          color="orange.800"
          fontSize="xs"
          px={2}
          py={0.5}
          borderRadius="full"
          borderWidth="1px"
          borderColor="orange.200"
        >
          {badge}
        </Box>
      )}
      <Box p={3} bg="indigo.50" color="indigo.500" borderRadius="lg">
        <Icon viewBox="0 0 24 24" boxSize={6}>
          {icon}
        </Icon>
      </Box>
      <Text fontWeight="medium" color="gray.700">
        {title}
      </Text>
    </Button>
  );
}

export default Home;
