import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import styles from '../styles/TopArticle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { Link } from 'next/link';
const imgPlaceholder = require('../public/images/picturePlaceholder.png');

function TopArticle(props) {
  const BACKEND_URL = process.env.BACKEND_URL;

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.value);

  const handleBookmarkClick = () => {
    if (!user.token) {
      return;
    }

    fetch(`${BACKEND_URL}/users/canBookmark/${user.token}`)
      .then(response => response.json())
      .then(data => {
        if (data.result && data.canBookmark) {
          if (props.isBookmarked) {
            dispatch(removeBookmark(props));
          } else {
            dispatch(addBookmark(props));
          }
        }
      });
  };

  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { color: '#E9BE59' };
  }

  console.log('props.url', props.url);
  return (
    <a href={props.url} target="_blank" className={styles.topContainer}>
      <Image
        src={props.urlToImage ?? imgPlaceholder}
        alt={props.title}
        height={314}
        width={600}
      />
      <div className={styles.topText}>
        <h2>{props.title}</h2>
        <FontAwesomeIcon
          onClick={() => handleBookmarkClick()}
          icon={faBookmark}
          style={iconStyle}
          className={styles.bookmarkIcon}
        />
        <h4>{props.author}</h4>
        <p>{props.description}</p>
      </div>
    </a>
  );
}

export default TopArticle;
