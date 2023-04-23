import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  // Set initial state for quote
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // Fetch a random quote from the API
    async function fetchQuote() {
      try {
        const res = await fetch('/api/random-quote');
        if (!res.ok) {
          throw new Error('Failed to fetch quote');
        }
        const data = await res.text();
        setQuote(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchQuote();
  }, []);

  // Render the quote or a loading message
  return (
    <div>
      {quote ? (
        <div dangerouslySetInnerHTML={{ __html: quote }} />
      ) : (
        <p>Loading...</p>
      )}
      {/* Add the Analytics component */}
      <Analytics />
    </div>
  );
}