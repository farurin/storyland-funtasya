import React from "react";
import { Link, useLocation } from "react-router-dom";

const Card = ({ book }) => {
  const location = useLocation();
  if (!book) return null;

  return (
    <Link
      to={`${location.pathname}?preview=${book.id}`}
      className="block w-full h-full rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white group"
    >
      <img
        src={`/images/books/${book.image}`}
        alt={book.title || "Cover Buku"}
        className="w-full h-65 md:h-63.75 object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150x220?text=Cover";
        }}
      />
    </Link>
  );
};

export default Card;
