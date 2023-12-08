import { useDispatch, useSelector } from 'react-redux';
import { hideArticle } from '../reducers/hiddenArticles';
import Image from 'next/image';
const noImgPlaceholder = require('../public/images/no-picture-placeholder.png');
import styles from '../styles/Article.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import BookmarkButton from './BookmarkButton';
import moment from 'moment';

function Article(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.value);

  const handleArticleClick = () => {
    if (props.url) {
      window.open(props.url, '_blank');
    }
  };

  const handleEyeSlashClick = event => {
    event.stopPropagation(); // Prevent event propagation to parent div
    dispatch(hideArticle(props.title));
  };

  return (
    <div className={styles.articles} onClick={handleArticleClick}>
      <div className={styles.articleHeader}>
        <h3>{props.title}</h3>
        <div className={styles.articleHeaderIcons}>
          <BookmarkButton title={props.title} />
          {props.hideIcon === 'show' ? (
            <FontAwesomeIcon
              onClick={handleEyeSlashClick}
              icon={faEyeSlash}
              className={styles.bookmarkIcon}
            />
          ) : null}
        </div>
      </div>
      <h4 style={{ textAlign: 'right' }}>
        {props.author ? `${props.author} | ` : null}
        {props.source.name}
      </h4>
      <div className={styles.divider}></div>
      <Image
        src={props.urlToImage ?? noImgPlaceholder}
        alt={props.title}
        width={600}
        height={314}
      />
      <p>{props.description}</p>
      <h4 style={{ textAlign: 'right' }}>
        - Published {moment(props.publishedAt).startOf('day').fromNow()} -
      </h4>
    </div>
  );
}

export default Article;
