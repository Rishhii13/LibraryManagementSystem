import { createContext, useState } from "react";

export const LibraryContext = createContext();

function LibraryProvider({ children }) {
  const [librarianName, setLibrarianName] =
    useState("Library Admin");

  /* ================= BOOKS ================= */

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Programming",
      copies: 8,
      available: 5,
    },
    {
      id: 2,
      title: "Java Reference",
      author: "Herbert Schildt",
      category: "Programming",
      copies: 10,
      available: 3,
    },
    {
      id: 3,
      title: "Database Concepts",
      author: "Abraham Silberschatz",
      category: "Database",
      copies: 6,
      available: 0,
    },
    {
      id: 4,
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      category: "Operating System",
      copies: 7,
      available: 2,
    },
  ]);

  /* ================= RETURN RECORDS ================= */

  const [returnRecords, setReturnRecords] = useState([
    {
      id: "TXN001",
      student: "Rahul Sharma",
      book: "Clean Code",
      issueDate: "2026-08-25",
      dueDate: "2026-08-30",
      returnDate: "",
      status: "Active",
    },
    {
      id: "TXN002",
      student: "Priya Patel",
      book: "Java Reference",
      issueDate: "2026-08-20",
      dueDate: "2026-08-28",
      returnDate: "",
      status: "Overdue",
    },
    {
      id: "TXN003",
      student: "Amit Shah",
      book: "Database Concepts",
      issueDate: "2026-08-27",
      dueDate: "2026-08-30",
      returnDate: "",
      status: "Due Today",
    },
    {
      id: "TXN004",
      student: "Neha Mehta",
      book: "Operating System Concepts",
      issueDate: "2026-08-22",
      dueDate: "2026-08-29",
      returnDate: "",
      status: "Overdue",
    },
  ]);

  /* ================= PAID FINES ================= */

  const [paidFines, setPaidFines] = useState([]);

  /* ================= ADD BOOK ================= */

  const addBook = (book) => {
    setBooks((previousBooks) => [
      ...previousBooks,
      {
        ...book,
        id: Date.now(),
      },
    ]);
  };

  /* ================= DELETE BOOK ================= */

  const deleteBook = (id) => {
    setBooks((previousBooks) =>
      previousBooks.filter((book) => book.id !== id)
    );
  };

  /* ================= BORROW BOOK ================= */

  const borrowBook = (id) => {
    setBooks((previousBooks) =>
      previousBooks.map((book) => {
        if (
          book.id === id &&
          book.available > 0
        ) {
          return {
            ...book,
            available: book.available - 1,
          };
        }

        return book;
      })
    );
  };

  /* ================= RETURN BOOK ================= */

  const returnBook = (id) => {
    setBooks((previousBooks) =>
      previousBooks.map((book) => {
        if (
          book.id === id &&
          book.available < book.copies
        ) {
          return {
            ...book,
            available: book.available + 1,
          };
        }

        return book;
      })
    );
  };

  /* ================= ADD RETURN RECORD ================= */

  const addReturnRecord = (record) => {
    setReturnRecords((previousRecords) => [
      ...previousRecords,
      {
        ...record,
        id: record.id || `TXN${Date.now()}`,
      },
    ]);
  };

  /* ================= COMPLETE RETURN ================= */

  const completeReturn = (id) => {
    const record = returnRecords.find(
      (item) => item.id === id
    );

    if (!record) {
      return;
    }

    /* Update the book's available copies */
    const book = books.find(
      (item) =>
        item.title.toLowerCase() ===
        record.book.toLowerCase()
    );

    if (book) {
      returnBook(book.id);
    }

    /* Update return transaction */
    const today = new Date()
      .toISOString()
      .split("T")[0];

    setReturnRecords((previousRecords) =>
      previousRecords.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            returnDate: today,
            status: "Returned",
          };
        }

        return item;
      })
    );
  };

  /* ================= MARK FINE AS PAID ================= */

  const markFinePaid = (fineId) => {
    setPaidFines((previousPaidFines) => {
      if (previousPaidFines.includes(fineId)) {
        return previousPaidFines;
      }

      return [
        ...previousPaidFines,
        fineId,
      ];
    });
  };

  /* ================= STATISTICS ================= */

  const totalBooks = books.length;

  const availableBooks = books.filter(
    (book) => book.available > 0
  ).length;

  const borrowedBooks = books.filter(
    (book) => book.available === 0
  ).length;

  /* ================= CONTEXT PROVIDER ================= */

  return (
    <LibraryContext.Provider
      value={{
        librarianName,
        setLibrarianName,

        books,

        addBook,
        deleteBook,

        borrowBook,
        returnBook,

        returnRecords,
        addReturnRecord,
        completeReturn,

        paidFines,
        markFinePaid,

        totalBooks,
        availableBooks,
        borrowedBooks,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export default LibraryProvider;