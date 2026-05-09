import { Flex, Text } from "@radix-ui/themes";

interface Props {
  subheading: string;
  fieldInfo: string | number | null | boolean;
}
const CustomFiledDetails = ({ subheading, fieldInfo }: Props) => {
  const value =
    fieldInfo === null || fieldInfo === "" ? "Not provided" : String(fieldInfo);

  return (
    <Flex direction="column" width="100%" gap="2">
      <Text className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {subheading}
      </Text>
      <div className="detail-value-card">
        <Text className="text-sm leading-6 text-[var(--color-text-primary)]">
          {value}
        </Text>
      </div>
    </Flex>
  );
};

export default CustomFiledDetails;
