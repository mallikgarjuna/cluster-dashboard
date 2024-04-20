import axios from "axios";
import React from "react";

interface Props {
  params: {
    jwt: string;
  };
}
const ActivationPage = async ({ params }: Props) => {
  const response = await axios.post(
    `${process.env.NEXTAUTH_URL}/api/users/activate`,
    {
      jwtUserId: params.jwt,
    }
  );
  const result = response.data;
  return (
    <div>
      <h1>ActivationPage</h1>
      <p>Activation for {params.jwt}</p>
      <p>{result}</p>
    </div>
  );
};

export default ActivationPage;
