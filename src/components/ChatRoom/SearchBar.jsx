import React from "react";
import "../../styles/ChatRoom/SearchBar.css";

function SearchBar() {
  return (
    <div className="searchBarContainer--chat-room">
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search..."
        className="search-input--chat-room "
      />
      <button className="relative search-btn--chat-room">
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 29C25.4183 29 29 25.4183 29 21C29 16.5817 25.4183 13 21 13C16.5817 13 13 16.5817 13 21C13 25.4183 16.5817 29 21 29Z"
            stroke="#4C98B0"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M31 31L26.7 26.7"
            stroke="#4C98B0"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default SearchBar;
