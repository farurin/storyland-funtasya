import React from "react";
import { Link, useLocation } from "react-router-dom";

const Card = ({ book }) => {
  const location = useLocation();
  if (!book) return null;

  return (
    <Link
      to={`${location.pathname}?preview=${book.id}`}
      className="block w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
    >
      <img
        src={`/images/books/${book.image}`}
        alt={book.title || "Cover Buku"}
        className="w-full h-56 md:h-63.75 object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150x220?text=Cover";
        }}
      />
    </Link>
  );
};

export default Card;
