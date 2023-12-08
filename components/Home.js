import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import styles from '../styles/Home.module.css';
import { useFetch } from '../hooks';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function Home() {
  const hiddenArticles = useSelector(state => state.hiddenArticles);
  const selectedSources = useSelector(state => state.sources);

  let articlesData = [];

  const { data, error, isLoading } = useFetch(
    `${BACKEND_URL}/articles/${selectedSources.join()}`,
    'GET',
    null,
    selectedSources
  );
  if (data) {
    articlesData = data.articles;
    articlesData.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB - dateA;
    });
  } else if (error) {
    console.error('[Mome.js] Fetch articles error', error);
  }

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {isLoading ? (
        <p className={styles.noArticlesInfo}>Loading articles...</p>
      ) : selectedSources.length > 0 ? (
        articlesData.length > 0 ? (
          <div className={styles.articlesContainer}>
            {articlesData.map(data => {
              const isHidden = hiddenArticles.some(
                articleTitle => articleTitle === data.title
              );
              if (!isHidden) {
                return (
                  <Article
                    key={data.title}
                    {...data}
                    isLoading={isLoading}
                    hideIcon={'show'}
                  />
                );
              }
            })}
          </div>
        ) : (
          <p className={styles.noArticlesInfo}>No articles found</p>
        )
      ) : (
        <p className={styles.noArticlesInfo}>Select a source to see articles</p>
      )}
    </div>
  );
}

export default Home;
