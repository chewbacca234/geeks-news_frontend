import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/TopArticle.module.css';
import { notification } from 'antd';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { useSelector } from 'react-redux';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function BookmarkButton({ title }) {
  const user = useSelector(state => state.user);
  const bookmarks = useSelector(state => state.bookmarks);

  let iconStyle = {};
  if (isBookmarked) {
    iconStyle = { color: '#E9BE59' };
  }

  const isBookmarked = bookmarks.some(bookmark => bookmark.title === title);

  const [api, contextHolder] = notification.useNotification();
  const openCanNotBookmarkNotification = () => {
    api.warning({
      message: "You can't bookmark articles",
      description: 'You may create an account to bookmark an article.',
    });
  };

  const handleBookmarkClick = () => {
    if (!user.token) {
      openCanNotBookmarkNotification();
    } else {
      fetch(`${BACKEND_URL}/users/canBookmark/${user.token}`)
        .then(response => response.json())
        .then(data => {
          if (data.result && data.canBookmark) {
            if (isBookmarked) {
              dispatch(removeBookmark(title));
            } else {
              dispatch(addBookmark(title));
            }
          }
        });
    }
  };

  return (
    <>
      {contextHolder}

      <FontAwesomeIcon
        onClick={handleBookmarkClick}
        icon={faBookmark}
        style={{ ...iconStyle, zIndex: 99 }}
        className={styles.bookmarkIcon}
      />
    </>
  );
}
