import { useState, useEffect } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [paragraphs, setParagraphs] = useState(null); // Array of paragraph strings
  const [contentLoading, setContentLoading] = useState(false);

  // Fetch book list (unchanged)
  useEffect(() => {
    let url = query
      ? `https://gutendex.com/books/?search=${encodeURIComponent(query)}`
      : 'https://gutendex.com/books/?languages=en';

    setLoading(true);
    setBooks([]);
    setNextPage(null);

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setBooks(data.results || []);
        setNextPage(data.next || null);
        setLoading(false);
      })
      .catch(() => {
        setBooks([]);
        setLoading(false);
      });
  }, [query]);

  const loadMore = () => {
    if (!nextPage || loading) return;
    setLoading(true);
    fetch(nextPage)
      .then(res => res.json())
      .then(data => {
        setBooks(prev => [...prev, ...(data.results || [])]);
        setNextPage(data.next || null);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm.trim());
  };

  // Fetch and turn into strict array of paragraph strings
  useEffect(() => {
    if (!selectedBook) return;

    setParagraphs(null);
    setContentLoading(true);

    const textUrl = getTextUrl(selectedBook);

    if (textUrl) {
      fetch(textUrl)
        .then(res => {
          if (!res.ok) throw new Error('Fetch failed');
          return res.text();
        })
        .then(text => {
          // Strip Gutenberg boilerplate
          let cleaned = text;
          const startRe = /\*{3,}\s*START OF (THE|THIS)? PROJECT GUTENBERG EBOOK.*\*{3,}/i;
          const endRe = /\*{3,}\s*END OF (THE|THIS)? PROJECT GUTENBERG EBOOK.*\*{3,}/i;

          const startMatch = text.match(startRe);
          if (startMatch) {
            cleaned = text.substring(startMatch.index + startMatch[0].length);
            const endMatch = cleaned.match(endRe);
            if (endMatch) {
              cleaned = cleaned.substring(0, endMatch.index);
            }
          }
          cleaned = cleaned.trim();

          // Split into original paragraphs (blank lines)
          const blocks = cleaned.split(/\r?\n\r?\n+/);

          // Reflow and create array of strings
          const paragraphsArray = blocks
            .map(block => block
              .replace(/\r?\n/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
            )
            .filter(p => p.length > 0);

          // LOG RAW ARRAY TO CONSOLE
          console.clear();
          console.log(`📚 PARAGRAPH ARRAY FOR "${selectedBook.title}"`);
          console.log(`Total paragraphs: ${paragraphsArray.length}`);
          console.log('Raw array (strings only):');
          console.log(paragraphsArray);

          setParagraphs(paragraphsArray);
          setContentLoading(false);
        })
        .catch(err => {
          console.error(err);
          setParagraphs(null);
          setContentLoading(false);
        });
    } else {
      setContentLoading(false);
    }
  }, [selectedBook]);

  const getCoverUrl = (book) => {
    const entry = Object.entries(book.formats).find(([mime]) =>
      mime.includes('image/') && (mime.includes('jpeg') || mime.includes('png'))
    );
    return entry ? entry[1] : null;
  };

  const getTextUrl = (book) => {
    const f = book.formats;
    if (f['text/plain; charset=utf-8']) return f['text/plain; charset=utf-8'];
    if (f['text/plain; charset=iso-8859-1']) return f['text/plain; charset=iso-8859-1'];
    if (f['text/plain; charset=us-ascii']) return f['text/plain; charset=us-ascii'];
    const plainKey = Object.keys(f).find(k => k.startsWith('text/plain'));
    return plainKey ? f[plainKey] : null;
  };

  const getAuthors = (book) => {
    return book.authors.length > 0
      ? book.authors.map(a => a.name).join(', ')
      : 'Unknown Author';
  };

  const gutenbergUrl = (book) => `https://www.gutenberg.org/ebooks/${book.id}`;

  // Reader view – NOW JUST SHOWS THE ARRAY
  if (selectedBook) {
    const authors = getAuthors(selectedBook);

    return (
      <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => setSelectedBook(null)}
          style={{
            marginBottom: '30px',
            padding: '12px 24px',
            fontSize: '18px',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ← Back to book list
        </button>

        {contentLoading ? (
          <div style={{ textAlign: 'center', fontSize: '28px', marginTop: '100px' }}>
            Loading book and creating paragraph array...
          </div>
        ) : paragraphs ? (
          <div>
            <h1 style={{ textAlign: 'center' }}>
              {selectedBook.title}
            </h1>
            <h2 style={{ textAlign: 'center', color: '#555', marginBottom: '40px' }}>
              by {authors}
            </h2>

            <div style={{
              background: '#f0f0f0',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '20px', margin: '0' }}>
                ✅ Paragraph array created! Total: <strong>{paragraphs.length}</strong> paragraphs
              </p>
              <p style={{ fontSize: '16px', color: '#555', margin: '10px 0 0 0' }}>
                Check browser console (F12) for the raw array too.
              </p>
            </div>

            <h2 style={{ marginBottom: '20px' }}>Raw array as JSON:</h2>
            <pre style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '20px',
              borderRadius: '10px',
              overflow: 'auto',
              fontSize: '16px',
              maxHeight: '600px',
            }}>
              {JSON.stringify(paragraphs, null, 2)}
            </pre>

            <h2 style={{ margin: '40px 0 20px 0' }}>How the paragraphs look separately:</h2>
            <ol style={{ paddingLeft: '30px' }}>
              {paragraphs.map((para, i) => (
                <li key={i} style={{
                  marginBottom: '40px',
                  padding: '20px',
                  background: '#f9f9f9',
                  borderRadius: '10px',
                  fontFamily: 'Georgia, serif',
                  fontSize: '18px',
                  lineHeight: '1.7',
                }}>
                  {para}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '22px' }}>
            <p>No text available for this book.</p>
            <a
              href={gutenbergUrl(selectedBook)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0066cc' }}
            >
              Open on Project Gutenberg ↗
            </a>
          </div>
        )}
      </div>
    );
  }

  // List view (unchanged)
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Public Domain Books Reader</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '40px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, author... (e.g. Pride and Prejudice)"
          style={{
            width: '70%',
            maxWidth: '500px',
            padding: '12px',
            fontSize: '18px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            marginLeft: '10px',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {loading && books.length === 0 ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found. Try classics like "Dracula" or "Alice in Wonderland".</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '30px',
            }}
          >
            {books.map((book) => {
              const coverUrl = getCoverUrl(book);
              const authors = getAuthors(book);
              const shortTitle =
                book.title.length > 50 ? book.title.substring(0, 50) + '...' : book.title;

              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  style={{
                    cursor: 'pointer',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={`${book.title} cover`}
                      style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '320px',
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                      }}
                    >
                      No cover
                    </div>
                  )}
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{shortTitle}</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>{authors}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {nextPage && (
            <div style={{ textAlign: 'center', margin: '50px 0' }}>
              <button
                onClick={loadMore}
                disabled={loading}
                style={{
                  padding: '12px 30px',
                  fontSize: '18px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;