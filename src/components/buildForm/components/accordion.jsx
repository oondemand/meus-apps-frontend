import {
  AccordionRoot,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from "../../../components/ui/accordion";

export const Accordion = ({ children, group }) => {
  return (
    <AccordionRoot collapsible>
      <AccordionItem>
        <AccordionItemTrigger color="gray.700">
          {group?.label}
        </AccordionItemTrigger>
        <AccordionItemContent mt="2">{children}</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
};
