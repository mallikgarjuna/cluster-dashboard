import React from "react";

interface Props {
  params: {
    id: string;
  };
}
const ActivationPage = ({ params }: Props) => {
  return (
    <div>
      <h1>ActivationPage</h1>
      <p>Activation for {params.id}</p>
    </div>
  );
};

export default ActivationPage;
