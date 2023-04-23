import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    async function fetchQuote() {
      const res = await fetch('/api/random-quote');
      const data = await res.text();
      setQuote(data);
    }
    fetchQuote();
  }, []);

  return (
    <div>
      {quote ? (
        <div dangerouslySetInnerHTML={{ __html: quote }} />
      ) : (
        <p>Loading...</p>
      )}
      <Analytics />
    </div>
  );
}
