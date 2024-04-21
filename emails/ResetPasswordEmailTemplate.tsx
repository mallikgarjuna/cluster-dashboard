import React from "react";
import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";

interface Props {
  firstName: string;
  resetUrl: string;
}

const ResetPasswordEmailTemplate = ({ firstName, resetUrl }: Props) => {
  return (
    <Html>
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body>
          <Container className="p-4 border border-solid border-gray-300 rounded-md">
            <Text>Hello {firstName},</Text>
            <Text>
              We've sent this email because you've forgotten your password!
            </Text>
            <Link href={resetUrl}>Reset Your Password</Link>
            <Section>
              <Text>
                Best,
                <br />
                The cluster-dashboard Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmailTemplate;
