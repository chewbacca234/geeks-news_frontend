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
          body: method !== 'GET' ? JSON.stringify(body) : null,
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
  }, [url, listenedState]);

  return {
    data,
    error,
    isLoading,
  };
};

const useFetchInsideFunction = (url, method = 'GET', body = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  (async () => {
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' ? JSON.stringify(body) : null,
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

  return {
    data,
    error,
    isLoading,
  };
};

export { useFetch, useFetchInsideFunction };
