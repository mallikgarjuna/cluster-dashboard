import { Grant } from "@prisma/client";
import React, { createContext, useState } from "react";

type TGrantContext = {
  grants: Grant[];
};

type GrantContextProps = {
  data: Grant[];
  children: React.ReactNode;
};

const GrantContext = createContext<TGrantContext | null>(null);

// TODO: not needing this provider for now;
export default function GrantContextProvider({
  data,
  children,
}: GrantContextProps) {
  // state
  const [grants, setGrants] = useState(data);

  return (
    <GrantContext.Provider value={{ grants }}>{children}</GrantContext.Provider>
  );
}
