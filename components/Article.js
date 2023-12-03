import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { hideArticle } from '../reducers/hiddenArticles';
import Image from 'next/image';
import styles from '../styles/Article.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useFetch } from '../hooks';

function Article(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.value);

  const handleBookmarkClick = () => {
    if (!user.token) {
      return;
    }

    const { data, error, isLoading } = useFetch(
      `http://localhost:3000/users/canBookmark/${user.token}`
    );
    if (data.result && data.canBookmark) {
      if (props.isBookmarked) {
        dispatch(removeBookmark(props));
      } else {
        dispatch(addBookmark(props));
      }
    }

    // fetch(`http://localhost:3000/users/canBookmark/${user.token}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.result && data.canBookmark) {
    //       if (props.isBookmarked) {
    //         dispatch(removeBookmark(props));
    //       } else {
    //         dispatch(addBookmark(props));
    //       }
    //     }
    //   });
  };

  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { color: '#E9BE59' };
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articleHeader}>
        <h3>{props.title}</h3>
        <FontAwesomeIcon
          onClick={() => handleBookmarkClick()}
          icon={faBookmark}
          style={iconStyle}
          className={styles.bookmarkIcon}
        />
        {props.hideIcon === 'show' ? (
          <FontAwesomeIcon
            onClick={() => dispatch(hideArticle(props.title))}
            icon={faEyeSlash}
            className={styles.bookmarkIcon}
          />
        ) : null}
      </div>
      <h4 style={{ textAlign: 'right' }}>- {props.author}</h4>
      <div className={styles.divider}></div>
      <Image
        src={props.urlToImage}
        alt={props.title}
        width={600}
        height={314}
        loader={props.isLoading}
        placeholder="blur"
        blurDataURL="images/picturePlaceholder.png"
        style={{ objectFit: 'cover', height: 370, width: 600 }}
      />
      <p>{props.description}</p>
    </div>
  );
}

export default Article;
