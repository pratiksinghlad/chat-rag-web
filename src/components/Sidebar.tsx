import { Box, VStack, Button, Icon, useColorModeValue } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const location = useLocation();

  return (
    <Box
      as="nav"
      w={{ base: "full", md: 60 }}
      h="full"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      py={4}
      display={{ base: "none", md: "block" }}
    >
      <VStack spacing={2} align="stretch" px={4}>
        <NavItem
          icon="home"
          label="Home"
          to="/home"
          isActive={location.pathname === "/home"}
        />
        <NavItem
          icon="chat"
          label="Chat"
          to="/chat"
          isActive={location.pathname === "/chat"}
        />
        <NavItem
          icon="document"
          label="Documents"
          to="#"
          isActive={false}
          isDisabled
        />
        <Box h="px" bg={borderColor} my={2} />
        <NavItem
          icon="settings"
          label="Settings"
          to="#"
          isActive={false}
          isDisabled
        />
      </VStack>
    </Box>
  );
}

function NavItem({
  icon,
  label,
  to,
  isActive,
  isDisabled,
}: {
  icon: string;
  label: string;
  to: string;
  isActive: boolean;
  isDisabled?: boolean;
}) {
  const getIcon = (name: string) => {
    switch (name) {
      case "home":
        return (
          <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        );
      case "chat":
        return (
          <path
            fill="currentColor"
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
          />
        );
      case "document":
        return (
          <path
            fill="currentColor"
            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
          />
        );
      case "settings":
        return (
          <path
            fill="currentColor"
            d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
          />
        );
      default:
        return null;
    }
  };

  const button = (
    <Button
      variant={isActive ? "solid" : "ghost"}
      colorScheme={isActive ? "blue" : "gray"}
      justifyContent="flex-start"
      w="full"
      leftIcon={
        <Icon viewBox="0 0 24 24" boxSize={5}>
          {getIcon(icon)}
        </Icon>
      }
      fontWeight={isActive ? "semibold" : "medium"}
      isDisabled={isDisabled}
      opacity={isDisabled ? 0.5 : 1}
    >
      {label}
    </Button>
  );

  if (isDisabled || to === "#") {
    return button;
  }

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      {button}
    </Link>
  );
}

export default Sidebar;
