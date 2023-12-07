import { useState, useEffect } from 'react';

const useFetch = (url, method = 'GET', body = {}, listenedState = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [listenedState]);

  return {
    data,
    error,
    isLoading,
  };
};

export { useFetch };
