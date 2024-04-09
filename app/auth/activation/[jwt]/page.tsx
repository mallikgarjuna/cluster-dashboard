import React from "react";

interface Props {
  params: {
    jwt: string;
  };
}
const ActivationPage = ({ params }: Props) => {
  return (
    <div>
      <h1>ActivationPage</h1>
      <p>Activation for {params.jwt}</p>
    </div>
  );
};

export default ActivationPage;
