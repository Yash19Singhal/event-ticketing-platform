// frontend/src/components/SearchBar.js

import React from 'react';


const SearchBar = ({ value, onChange, onSubmit }) => {
  return (
    
    <form onSubmit={onSubmit} style={{ display: 'flex', width: '100%', maxWidth: '600px', margin: '20px auto' }}>
      <input
        type="text"
        placeholder="Search for events by keyword..."
        value={value} 
        onChange={onChange} 
        style={{
          flex: 1, 
          padding: '12px 15px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px 0 0 4px', 
        }}
      />
      <button type="submit" style={{
        padding: '12px 20px',
        fontSize: '16px',
        border: '1px solid #007bff',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '0 4px 4px 0', 
      }}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;