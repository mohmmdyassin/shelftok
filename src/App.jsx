import React, { useEffect, useState } from "react";

function App() {
  const [allBooks, setAllBooks] = useState([]); // full list of 100 books
  const [displayedBooks, setDisplayedBooks] = useState([]); // currently shown
  const [following, setFollowing] = useState({});
  const [nextIndex, setNextIndex] = useState(0); // next slice index
  const BATCH_SIZE = 10; // show 10 each time

  // Format author names "Last, First" → "First Last"
  const formatAuthor = (name) => {
    if (!name.includes(",")) return name;
    const [last, first] = name.split(",").map((s) => s.trim());
    return `${first} ${last}`;
  };

  // Fetch Gutendex books (get ~100 books)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://gutendex.com/books");
        const data = await response.json();

        // process first page + next pages if needed to reach 100
        let books = data.results.map((book) => ({
          id: book.id,
          title: book.title,
          authors: book.authors.map((a) => formatAuthor(a.name)).join(", "),
          cover: book.formats["image/jpeg"] || null,
        }));

        // If not enough, fetch next page
        if (books.length < 100 && data.next) {
          const nextResponse = await fetch(data.next);
          const nextData = await nextResponse.json();
          const nextBooks = nextData.results.map((book) => ({
            id: book.id,
            title: book.title,
            authors: book.authors.map((a) => formatAuthor(a.name)).join(", "),
            cover: book.formats["image/jpeg"] || null,
          }));
          books = [...books, ...nextBooks];
        }

        // shuffle and keep top 100
        books = books.sort(() => 0.5 - Math.random()).slice(0, 100);
        setAllBooks(books);

        // show first 10
        setDisplayedBooks(books.slice(0, BATCH_SIZE));
        setNextIndex(BATCH_SIZE);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Show next batch of books
  const showMore = () => {
    if (nextIndex >= allBooks.length) return; // nothing more
    const nextBatch = allBooks.slice(nextIndex, nextIndex + BATCH_SIZE);
    setDisplayedBooks((prev) => [...prev, ...nextBatch]);
    setNextIndex(nextIndex + BATCH_SIZE);
  };

  // Follow/unfollow a book
  const toggleFollow = (id) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        ShelfTok: Books Grid
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {displayedBooks.map((book) => (
          <div
            key={book.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "15px",
              overflow: "hidden",
              background: "#111",
              padding: "15px",
              width: "180px",
              boxShadow: "0 4px 15px rgba(255,255,255,0.1)",
              transition: "transform 0.2s",
            }}
          >
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                style={{
                  width: "150px",
                  height: "225px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "150px",
                  height: "225px",
                  backgroundColor: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontSize: "12px",
                  borderRadius: "10px",
                }}
              >
                No Cover
              </div>
            )}

            <h2
              style={{
                fontSize: "16px",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {book.title}
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#ccc",
                margin: "5px 0 15px 0",
                textAlign: "center",
              }}
            >
              {book.authors}
            </p>

            <button
              onClick={() => toggleFollow(book.id)}
              style={{
                background: following[book.id] ? "#ff4040" : "#1da1f2",
                color: "#fff",
                border: "none",
                borderRadius: "25px",
                padding: "8px 20px",
                fontSize: "12px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {following[book.id] ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>

      {nextIndex < allBooks.length && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={showMore}
            style={{
              background: "#1da1f2",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              padding: "10px 25px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
