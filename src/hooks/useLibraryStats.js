function useLibraryStats(books) {
  const total = books.length;

  const available = books.filter(
    (book) => book.available > 0
  ).length;

  const borrowed = books.filter(
    (book) => book.available === 0
  ).length;

  return {
    total,
    available,
    borrowed,
  };
}

export default useLibraryStats;