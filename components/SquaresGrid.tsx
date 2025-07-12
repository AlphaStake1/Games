import React from 'react';

const SquaresGrid = () => {
  return (
    <div className="flex-grow p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-6">
        Football Squares
      </h1>
      <div className="grid grid-cols-11 grid-rows-11 gap-1 max-w-2xl mx-auto border-2 border-dashed border-gray-400 p-2">
        {/* Top Header */}
        <div className="col-start-2 col-span-10 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`top-header-${i}`}
              className="flex items-center justify-center bg-gray-200 aspect-square text-sm font-bold"
            >
              ?
            </div>
          ))}
        </div>

        {/* Side Header */}
        <div className="row-start-2 row-span-10 grid grid-rows-10 gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`side-header-${i}`}
              className="flex items-center justify-center bg-gray-200 aspect-square text-sm font-bold"
            >
              ?
            </div>
          ))}
        </div>

        {/* Grid Area */}
        <div className="col-start-2 col-span-10 row-start-2 row-span-10 grid grid-cols-10 grid-rows-10 gap-1">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={`cell-${i}`}
              className="bg-white hover:bg-gray-100 aspect-square cursor-pointer border border-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SquaresGrid;