"use client";
import Image from "next/image";
import { DataTable } from "@/components/datatable/data-table";
import { getUsers } from "@/lib/api";
import { useState, useEffect } from "react";
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [start, setStart] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = getUsers(debouncedQuery, start, limit);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // debounce delay

    return () => clearTimeout(timeout); // clear timeout if query changes
  }, [searchQuery]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <main className="flex flex-col items-center justify-center w-full p-8 space-y-6 bg-card rounded-lg shadow-md ">
        <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">
          Pantavanij User Management
        </h1>
        <p className="text-lg text-muted-foreground text-center sm:text-left">
          This is a simple user management system built with Next.js and
          Tailwind CSS.
        </p>
        {isLoading ? (
          <p className="text-lg text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-lg text-red-500">Failed to load users.</p>
        ) : (
          <DataTable
            data={users}
            limit={limit}
            start={start}
            setStart={setStart}
            setLimit={setLimit}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            mutate={mutate}
          />
        )}
      </main>
    </div>
  );
}
