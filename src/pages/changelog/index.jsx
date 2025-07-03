import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import changelog from "../../../CHANGELOG.md?raw";
import { Prose } from "../../components/ui/prose";
import { Container } from "../../components/container";

export default function ChangelogPage() {
  console.log("CHANGELOG", changelog);

  return (
    <Box h="full" w="full" overflow="auto" bg="#F8F9FA" pt="8" pl="8">
      <Prose shadow="xs" minW="full" p="8" bg="white" roundedLeft="lg">
        <ReactMarkdown>{changelog}</ReactMarkdown>
      </Prose>
    </Box>
  );
}
