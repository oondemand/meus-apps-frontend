import { Box, Button, Flex, Text, Icon } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { NavLink } from "./navLink";

import { Link } from "react-router-dom";
import { useConfirmation } from "../../../hooks/useConfirmation";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../../ui/accordion";
import { menuItems } from "./menu";

export const AuthLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const { requestConfirmation } = useConfirmation();

  if (!user && isLoading === false) {
    return <Navigate to="/login" replace />;
  }

  const handleLogOut = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja sair ?",
      description: "Você tera que fazer o login novamente.",
    });

    if (action === "confirmed") {
      logout();
    }
  };

  return (
    <Flex direction="row" minHeight="100vh" minW="100vw">
      <Flex
        pt="4"
        flexDir="column"
        maxW="160px"
        minW="160px"
        w="160px"
        borderRight="1px solid"
        borderColor="gray.100"
        gap="2"
      >
        <Flex
          pb="2"
          mb="1"
          w="full"
          alignItems="center"
          justifyContent="center"
          borderBottom="1px solid"
          borderColor="gray.50"
        >
          <Link to="/" viewTransition>
            <Box w="120px">
              {/* <img src="/logo_rakuten_purple.png" alt="RAKUTEN" /> */}
              <Text fontSize="lg" fontWeight="700">
                oondemand
              </Text>
            </Box>
          </Link>
        </Flex>
        {menuItems.map((item, index) => {
          if (item?.rules?.includes(user?.tipo)) return;

          if (item?.subLinks)
            return (
              <AccordionRoot collapsible key={`${item.title}-${index}`}>
                <AccordionItem border="none">
                  <AccordionItemTrigger
                    cursor="pointer"
                    gap="1"
                    px="3"
                    border="none"
                  >
                    <Flex rounded="40%" gap="3" bg="white" alignItems="center">
                      <Icon
                        as={item?.icon}
                        w="18px"
                        h="18px"
                        color="brand.500"
                      />
                      <Text
                        fontSize="12px"
                        color="gray.500"
                        fontWeight="semibold"
                      >
                        {item?.title}
                      </Text>
                    </Flex>
                  </AccordionItemTrigger>
                  <AccordionItemContent w="full">
                    {item?.subLinks.map((item, i) => {
                      if (item?.rules?.includes(user?.tipo)) return;
                      return (
                        <Box w="full" pb="2" key={`${item.title}-${index}`}>
                          <NavLink
                            to={item?.href ?? "#"}
                            icon={item.icon}
                            title={item.title}
                            i={index}
                          />
                        </Box>
                      );
                    })}
                  </AccordionItemContent>
                </AccordionItem>
              </AccordionRoot>
            );

          return (
            <NavLink
              key={`${item.title}-${index}`}
              to={item?.href ?? "#"}
              icon={item.icon}
              title={item.title}
              i={index}
            />
          );
        })}
        <Button
          onClick={handleLogOut}
          mt="2"
          unstyled
          display="flex"
          gap="3"
          textAlign="left"
          px="4"
          alignItems="center"
          color="gray.700"
          fontSize="sm"
          cursor="pointer"
        >
          <LogOut color="#0474AF" size={18} /> Sair
        </Button>
      </Flex>

      <Flex
        flex="1"
        flexDir="column"
        height="calc(100vh)"
        paddingBottom="0"
        overflow="hidden"
      >
        <Flex flex="1" flexDir="column" py="8" px="6" bg="#F8F9FA">
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  );
};
