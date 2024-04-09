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
  activationUrl: string;
}

const ActivateEmailTemplate = ({ firstName, activationUrl }: Props) => {
  return (
    <Html>
      <Preview>Activate your account</Preview>
      <Tailwind>
        <Body>
          <Container className="p-4 border border-solid border-gray-300 rounded-md">
            <Text>Hello {firstName},</Text>
            <Text>
              Welcome to cluster-dashbaord. Please click on a link below to
              activate your account.
            </Text>
            <Link href={activationUrl}>
              Activate your cluster-dashboard account
            </Link>
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

export default ActivateEmailTemplate;
