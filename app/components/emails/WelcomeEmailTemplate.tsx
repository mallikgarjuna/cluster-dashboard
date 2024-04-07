import React from "react";

interface Props {
  firstName: string;
}
const WelcomeEmailTemplate = ({ firstName }: Props) => {
  return (
    <div>
      <h1>WelcomeEmail, {firstName}</h1>
    </div>
  );
};

export default WelcomeEmailTemplate;
