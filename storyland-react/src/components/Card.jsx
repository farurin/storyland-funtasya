import React from "react";

const Card = ({ book }) => {
  return (
    <div className="w-40 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
      <img
        src={`/images/books/${book.image}`}
        alt={book.title}
        className="w-full h-56 object-cover"
      />

      {/* bisa dihapus nanti */}
      {/* <p>{book.title}</p> */}
    </div>
  );
};

export default Card;
