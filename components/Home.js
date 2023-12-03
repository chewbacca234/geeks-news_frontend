import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';
import { useFetch } from '../hooks';

function Home() {
  const BACKEND_URL = process.env.BACKEND_URL;

  console.log('BACKEND_URL', BACKEND_URL);

  const bookmarks = useSelector(state => state.bookmarks.value);
  const hiddenArticles = useSelector(state => state.hiddenArticles);

  const articlesData = [];
  let topArticle = null;

  const { data, error, isLoading } = useFetch(
    `https://morningnews-backend-lovat.vercel.app/articles`
  );
  if (data) {
    topArticle = data.articles[0];
    articlesData.unshift(...data.articles.filter((_, i) => i > 0));
  } else {
    console.error('[Mome.js] Fetch articles error', error);
  }

  const articles = articlesData.map((data, i) => {
    const isBookmarked = bookmarks.some(
      bookmark => bookmark.title === data.title
    );
    const isHidden = hiddenArticles.some(
      articleTitle => articleTitle === data.title
    );
    if (!isHidden) {
      return (
        <Article
          key={data.title}
          {...data}
          isLoading={isLoading}
          isBookmarked={isBookmarked}
          hideIcon={'show'}
        />
      );
    }
  });

  let topArticles;
  if (bookmarks.some(bookmark => bookmark.title === topArticle.title)) {
    topArticles = (
      <TopArticle {...topArticle} isBookmarked={true} isLoading={isLoading} />
    );
  } else {
    topArticles = (
      <TopArticle {...topArticle} isBookmarked={false} isLoading={isLoading} />
    );
  }

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {topArticles}
      <div className={styles.articlesContainer}>{articles}</div>
    </div>
  );
}

export default Home;
