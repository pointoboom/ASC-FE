'use client'
import { SWRConfig } from "swr";
import fetcher from "@/lib/fetcher";

export default function SWRProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SWRConfig
      value={{
        fetcher, // Custom fetcher function (optional)
        onError: (error) => {
          if (process.env.NODE_ENV === "development") {
            console.error(error);
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}