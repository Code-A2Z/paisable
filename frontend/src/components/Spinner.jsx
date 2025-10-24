import React from 'react';

const Spinner = ({ inline = false }) => {
  if (inline) {
    return (
      <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
    );
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
    </div>
  );
};

export default Spinner;