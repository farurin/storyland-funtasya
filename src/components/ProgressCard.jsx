import React from "react";

const ProgressCard = ({ progress }) => {
  const { book, reading_progress } = progress;

  return (
    <div className="w-40 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
      {/* cover buku */}
      <img
        src={
          book?.image ? `../images/books/${book.image}` : "/images/default.png"
        }
        alt={book?.title || "Buku"}
        className="w-full h-52 object-cover"
      />

      {book.title}

      {/* progress bar */}
      <div className="px-2 py-2">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${reading_progress ?? 0}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">
          {reading_progress ?? 0}%
        </p>
      </div>
    </div>
  );
};

export default ProgressCard;
