import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const projectsSearch = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="relative  justify-center w-full max-w-md">
        <input
          type="text"
          placeholder="Search for Launches,categories,or more..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search />
        </span>
      </div>
    </>
  );
};

export default SearchBar;
