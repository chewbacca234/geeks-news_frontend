import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';
import { useFetch } from '../hooks';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function Home() {
  const hiddenArticles = useSelector(state => state.hiddenArticles);
  const selectedSources = useSelector(state => state.sources);

  const articlesData = [];
  let topArticle = null;

  const { data, error, isLoading } = useFetch(
    `${BACKEND_URL}/articles/:${selectedSources.join()}`
  );
  if (data) {
    topArticle = data.articles[0];
    articlesData.unshift(...data.articles.filter((_, i) => i > 0));
  } else if (error) {
    console.error('[Mome.js] Fetch articles error', error);
  }

  const articles = articlesData.map(data => {
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
  });

  const topArticleComponent = (
    <TopArticle {...topArticle} isLoading={isLoading} />
  );

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {topArticleComponent}
      <div className={styles.articlesContainer}>{articles}</div>
    </div>
  );
}

export default Home;
