import data from "../../data.json";

// get all books
function getAllBooks() {
  return data.books;
}

// get books by categories
function getBookByCategories(catId) {
  return data.books.filter((book) => book.id_categories === catId);
}

// get all categories
function getAllCategories() {
  return data.categories;
}

// get categories with their books
function getCategoriesWithBooks() {
  return data.categories.map((category) => ({
    ...category,
    books: data.books.filter((book) => book.id_categories === category.id),
  }));
}

// get books by category name
function getBooksByCategoryName(categoryName) {
  const category = data.categories.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase(),
  );

  if (!category) {
    return [];
  }

  return data.books.filter((book) => book.id_categories === category.id);
}

// get all progress with book detail
function getAllProgress() {
  return data.progress.map((progress) => ({
    ...progress,
    book: data.books.find((book) => book.id === progress.id_book) || null,
  }));
}

// get progress grouped by date
function getProgressGroupedByDate() {
  const progressWithBooks = getAllProgress();

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  return progressWithBooks.reduce((groups, item) => {
    const date = new Date(item.last_read_at).toDateString();
    const label =
      date === today ? "Hari ini" : date === yesterday ? "Kemarin" : date;

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
    return groups;
  }, {});
}

// get favorite books with book detail
function getFavoriteBooks() {
  return data.favorite.map((fav) => ({
    ...fav,
    book: data.books.find((book) => book.id === fav.id_book) || null,
  }));
}

// get saved books with book detail
function getSavedBooks() {
  return data.progress
    .filter((p) => p.saved === true)
    .map((progress) => ({
      ...progress,
      book: data.books.find((book) => book.id === progress.id_book) || null,
    }));
}

export {
  getAllBooks,
  getBookByCategories,
  getAllCategories,
  getCategoriesWithBooks,
  getBooksByCategoryName,
  getAllProgress,
  getProgressGroupedByDate,
  getFavoriteBooks,
  getSavedBooks,
};
