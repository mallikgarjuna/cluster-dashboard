import { Flex, Card, Text } from "@radix-ui/themes";
import React from "react";

interface Props {
  subheading: string;
  fieldInfo: string | number | null;
}
const CustomFiledDetails = ({ subheading, fieldInfo }: Props) => {
  return (
    <Flex direction="column">
      <Text weight="bold">{subheading}</Text>
      <Card>
        <Text style={{ border: " 2px solid gray-500" }}>{fieldInfo}</Text>
      </Card>
    </Flex>
  );
};

export default CustomFiledDetails;
