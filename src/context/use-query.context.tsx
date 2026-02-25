import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryContextProps {
  children: React.ReactNode;
}

const UseQueryContext = ({ children }: QueryContextProps) => {
  const client = new QueryClient();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default UseQueryContext;
