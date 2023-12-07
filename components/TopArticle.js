// import { useDispatch, useSelector } from 'react-redux';
// import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import styles from '../styles/TopArticle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import BookmarkButton from './BookmarkButton';
import { useFetch } from '../hooks';
import { addBookmark } from '../reducers/bookmarks';
const imgPlaceholder = require('../public/images/picturePlaceholder.png');

function TopArticle(props) {
  // const dispatch = useDispatch();
  // const user = useSelector(state => state.user.value);

  // const handleBookmarkClick = () => {
  //   if (!user.token) {
  //     return;
  //   }

  //   const { data, error } = useFetch(
  //     `https://morningnews-backend-lovat.vercel.app/articles`
  //   );
  //   if (data.result && data.canBookmark) {
  //     if (props.isBookmarked) {
  //       dispatch(removeBookmark(props));
  //     } else {
  //       dispatch(addBookmark(props));
  //     }
  //   }

  //   //   fetch(
  //   //     `https://morningnews-backend-lovat.vercel.app/users/canBookmark/${user.token}`
  //   //   )
  //   //     .then(response => response.json())
  //   //     .then(data => {
  //   //       if (data.result && data.canBookmark) {
  //   //         if (props.isBookmarked) {
  //   //           dispatch(removeBookmark(props));
  //   //         } else {
  //   //           dispatch(addBookmark(props));
  //   //         }
  //   //       }
  //   //     });
  // };

  // let iconStyle = {};
  // if (props.isBookmarked) {
  //   iconStyle = { color: '#E9BE59' };
  // }

  return (
    <div className={styles.topContainer}>
      <a href={props.url ?? '/'} target="_blank">
        <Image
          src={props.urlToImage ?? imgPlaceholder}
          alt={props.title ?? 'Placeholder image'}
          height={314}
          width={600}
        />
      </a>
      <div className={styles.topText}>
        <a
          href={props.url ?? '/'}
          target="_blank"
          style={{ textDecoration: 'none', color: 'black' }}
        >
          <h2>{props.title}</h2>
        </a>
        <BookmarkButton title={props.title} />
        <a
          href={props.url ?? '/'}
          target="_blank"
          style={{ textDecoration: 'none', color: 'black' }}
        >
          <h4>{props.author}</h4>
          <p>{props.description}</p>
        </a>
      </div>
    </div>
  );
}

export default TopArticle;
