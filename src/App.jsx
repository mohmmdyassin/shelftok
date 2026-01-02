import { useState, useEffect } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('profile'); // 'profile' or 'reading'

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

  const handleSearch = () => {
    setQuery(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (!selectedBook) return;

    setParagraphs([]);
    setContentLoading(true);
    setIsFullyLoaded(false);

    const textUrl = getTextUrl(selectedBook);

    if (!textUrl) {
      setContentLoading(false);
      return;
    }

    // Use corsproxy.io as a reliable CORS proxy
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(textUrl)}`;

    fetch(proxyUrl)
      .then(async (res) => {
        if (!res.ok || !res.body) throw new Error('Failed');

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let inBook = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (buffer.trim() && inBook) {
              const lastParts = buffer.split(/\r?\n\r?\n+/);
              for (const part of lastParts) {
                const para = part.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
                if (para) {
                  setParagraphs(prev => [...prev, para]);
                }
              }
            }
            setIsFullyLoaded(true);
            setContentLoading(false);
            console.clear();
            console.log(`📚 FULL PARAGRAPH ARRAY LOADED FOR "${selectedBook.title}"`);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          if (!inBook) {
            const startIndex = buffer.toUpperCase().indexOf('*** START OF ');
            if (startIndex !== -1) {
              buffer = buffer.substring(startIndex);
              const markerMatch = buffer.match(/\*{3,}.*\*{3,}/i);
              if (markerMatch) {
                buffer = buffer.substring(markerMatch[0].length);
                inBook = true;
              }
            }
          }

          if (inBook) {
            const parts = buffer.split(/\r?\n\r?\n+/);
            if (parts.length > 1) {
              for (let i = 0; i < parts.length - 1; i++) {
                const para = parts[i].replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
                if (para) {
                  setParagraphs(prev => [...prev, para]);
                }
              }
              buffer = parts[parts.length - 1];
            }
          }

          if (buffer.toUpperCase().includes('*** END OF ')) {
            reader.cancel();
            setIsFullyLoaded(true);
            setContentLoading(false);
            break;
          }
        }
      })
      .catch(err => {
        console.error(err);
        setContentLoading(false);
      });
  }, [selectedBook]);

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paragraphs, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${selectedBook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_paragraphs.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const getCoverUrl = (book) => {
    const entry = Object.entries(book.formats).find(([mime]) =>
      mime.includes('image/') && (mime.includes('jpeg') || mime.includes('png'))
    );
    return entry ? entry[1] : null;
  };

  const getTextUrl = (book) => {
    const f = book.formats;
    let url = null;
    
    // Try to find a text format
    if (f['text/plain; charset=utf-8']) url = f['text/plain; charset=utf-8'];
    else if (f['text/plain; charset=iso-8859-1']) url = f['text/plain; charset=iso-8859-1'];
    else if (f['text/plain; charset=us-ascii']) url = f['text/plain; charset=us-ascii'];
    else {
      const plainKey = Object.keys(f).find(k => k.startsWith('text/plain'));
      url = plainKey ? f[plainKey] : null;
    }
    
    if (!url) return null;
    
    // Fix Gutenberg URLs - convert /ebooks/ID.txt.utf-8 to /files/ID/ID-0.txt
    const ebookMatch = url.match(/\/ebooks\/(\d+)\.txt/);
    if (ebookMatch) {
      const id = ebookMatch[1];
      url = `https://www.gutenberg.org/files/${id}/${id}-0.txt`;
    }
    
    // Convert www.gutenberg.org to gutenberg.org for better CORS
    if (url.includes('www.gutenberg.org')) {
      url = url.replace('www.gutenberg.org', 'gutenberg.org');
    }
    
    return url;
  };

  const getAuthors = (book) => {
    return book.authors.length > 0 ? book.authors.map(a => a.name).join(', ') : 'Unknown Author';
  };

  // TikTok Profile View
  if (selectedBook && viewMode === 'profile') {
    const authors = getAuthors(selectedBook);
    const coverUrl = getCoverUrl(selectedBook);

    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#000',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        paddingBottom: '60px'
      }}>
        {/* Header */}
        <div style={{
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #333'
        }}>
          <button
            onClick={() => {
              setSelectedBook(null);
              setViewMode('profile');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ←
          </button>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Book</div>
          <div style={{ width: '24px' }}></div>
        </div>

        {/* Profile Section */}
        <div style={{ padding: '30px 20px', textAlign: 'center' }}>
          {/* Cover Image */}
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={selectedBook.title}
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid #fff',
                marginBottom: '20px'
              }}
            />
          ) : (
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#333',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            }}>
              📚
            </div>
          )}

          {/* Title */}
          <h1 style={{ fontSize: '20px', margin: '10px 0', fontWeight: 'bold' }}>
            {selectedBook.title}
          </h1>

          {/* Author */}
          <p style={{ fontSize: '14px', color: '#aaa', margin: '5px 0' }}>
            {authors}
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            margin: '25px 0',
            fontSize: '14px'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {contentLoading ? '...' : paragraphs.length}
              </div>
              <div style={{ color: '#aaa' }}>Posts</div>
            </div>
          </div>

          {/* Download Button */}
          {isFullyLoaded && (
            <button
              onClick={downloadJson}
              style={{
                background: '#fe2c55',
                color: 'white',
                border: 'none',
                padding: '12px 50px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Download JSON
            </button>
          )}
        </div>

        {/* Loading State */}
        {contentLoading && paragraphs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#aaa'
          }}>
            Loading paragraphs...
          </div>
        )}

        {/* Posts Grid */}
        {paragraphs.length > 0 && (
          <>
            <div style={{
              borderTop: '1px solid #333',
              borderBottom: '1px solid #333',
              padding: '10px 0',
              textAlign: 'center',
              fontSize: '14px',
              color: '#aaa',
              display: 'flex',
              justifyContent: 'center',
              gap: '40px'
            }}>
              <div style={{ 
                color: 'white', 
                borderBottom: '2px solid white',
                paddingBottom: '10px'
              }}>
                ▦ POSTS
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px',
              background: '#000'
            }}>
              {paragraphs.map((para, i) => (
                <div
                  key={i}
                  onClick={() => setViewMode('reading')}
                  style={{
                    aspectRatio: '1',
                    background: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    lineHeight: '1.4',
                    color: '#fff',
                    textAlign: 'center',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {para}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: '5px',
                    fontSize: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}>
                    #{i + 1}
                  </div>
                </div>
              ))}
            </div>

            {contentLoading && (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: '#aaa',
                fontSize: '14px'
              }}>
                Loading more posts... ({paragraphs.length} loaded)
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // TikTok Reading View (full screen vertical scroll)
  if (selectedBook && viewMode === 'reading') {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw',
        background: '#000',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => setViewMode('profile')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            height: '100%',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {paragraphs.map((para, i) => (
            <div
              key={i}
              style={{
                height: '100vh',
                scrollSnapAlign: 'start',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 30px',
                boxSizing: 'border-box',
                background: i % 2 === 0 ? '#000' : '#111'
              }}
            >
              <p style={{
                color: 'white',
                fontSize: '20px',
                lineHeight: '1.8',
                maxWidth: '600px',
                textAlign: 'center',
                fontFamily: 'Georgia, serif',
                margin: 0
              }}>
                {para}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Book List View
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Public Domain Books Reader</h1>

      <div style={{ marginBottom: '40px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by title, author... (e.g. A Christmas Carol for fast load)"
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
          onClick={handleSearch}
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
      </div>

      {loading && books.length === 0 ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found. Try "Christmas Carol" or "Metamorphosis" for super fast loads.</p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '30px',
          }}>
            {books.map((book) => {
              const coverUrl = getCoverUrl(book);
              const authors = getAuthors(book);
              const shortTitle = book.title.length > 50 ? book.title.substring(0, 50) + '...' : book.title;

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
                    <img src={coverUrl} alt={`${book.title} cover`} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '320px',
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                    }}>
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
              <button onClick={loadMore} disabled={loading} style={{
                padding: '12px 30px',
                fontSize: '18px',
                background: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
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