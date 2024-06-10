import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import {
  addAllBookmarks,
  addBookmark,
  bookmarks,
  removeAllBookmarks,
} from '../reducers/bookmarks';
import {
  addAllHiddenArticles,
  hiddenArticles,
  hideArticle,
  hideArticles,
  showAllArticles,
} from '../reducers/hiddenArticles';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faEye } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import { Modal, Tooltip } from 'antd';
import Link from 'next/link';
import { useFetch, useForm } from '../hooks';
import { addSource, removeAllSources, removeSource } from '../reducers';
import { addAllSources } from '../reducers/sources';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const selectedSources = useSelector(state => state.sources);
  const hiddenArticles = useSelector(state => state.hiddenArticles);
  const bookmarks = useSelector(state => state.bookmarks);

  const [date, setDate] = useState('2050-11-22T23:59:59');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { formData, handleChange, handleSubmit } = useForm({
    onSubmit: e =>
      e.target.firstChild.name === 'signUpUsername'
        ? handleRegister(formData.signUpUsername, formData.signUpPassword)
        : handleConnection(formData.signInUsername, formData.signInPassword),
  });
  const signUpFields = [
    {
      name: 'signUpUsername',
      type: 'text',
      placeholder: 'Username',
    },
    {
      name: 'signUpPassword',
      type: 'password',
      placeholder: 'password',
    },
  ];
  const signInFields = [
    {
      name: 'signInUsername',
      placeholder: 'Username',
    },
    {
      name: 'signInPassword',
      type: 'password',
      placeholder: 'password',
    },
  ];

  useEffect(() => {
    setDate(new Date());
  }, []);

  const { data, isLoading: loadingSources } = useFetch(
    `${BACKEND_URL}/sources`
  );
  const sources = data?.sources;

  const handleRegister = (username, password) => {
    fetch(`${BACKEND_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        hiddenArticles,
        sources: selectedSources,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ username: data.username, token: data.token }));
        }
      })
      .finally(() => setIsModalVisible(false));
  };

  const handleConnection = (username, password) => {
    fetch(`${BACKEND_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('data', data);
          dispatch(login({ username: data.username, token: data.token }));
          dispatch(addAllBookmarks(data.bookmarks));
          dispatch(addAllSources(data.sources));
          dispatch(addAllHiddenArticles(data.hiddenArticles));
        }
      })
      .finally(() => setIsModalVisible(false));
  };

  const handleLogout = () => {
    fetch(`${BACKEND_URL}/users/update`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        hiddenArticles,
        bookmarks,
        sources: selectedSources,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('data', data);
          dispatch(removeAllBookmarks());
          dispatch(showAllArticles());
          dispatch(removeAllSources());
          dispatch(logout());
        }
      })
      .catch(error => console.error(error));
  };

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const sourceIsSelected = sourceId =>
    selectedSources.some(source => source === sourceId);

  const handleSourceClick = sourceId => {
    if (sourceIsSelected(sourceId)) {
      dispatch(removeSource(sourceId));
    } else {
      dispatch(addSource(sourceId));
    }
  };

  let modalContent;
  if (!user.isConnected) {
    modalContent = (
      <div className={styles.registerContainer}>
        <div className={styles.registerSection}>
          <p>Sign-up</p>
          <form className={styles.registerSectionForm} onSubmit={handleSubmit}>
            {signUpFields.map(field => (
              <input key={field.name} {...field} onChange={handleChange} />
            ))}
            <button type="submit">Register</button>
          </form>
        </div>
        <div
          className={`${styles.registerSection} ${styles.registerSectionRight}`}
        >
          <p>Sign-in</p>
          <form className={styles.registerSectionForm} onSubmit={handleSubmit}>
            {signInFields.map(field => (
              <input key={field.name} {...field} onChange={handleChange} />
            ))}
            <button type="submit">Connect</button>
          </form>
        </div>
      </div>
    );
  }

  let userSection;
  if (user.token) {
    userSection = (
      <div className={styles.logoutSection}>
        <p>Welcome {user.username} / </p>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
    );
  } else {
    if (isModalVisible) {
      userSection = (
        <div className={styles.headerIcons}>
          <FontAwesomeIcon
            onClick={showModal}
            className={styles.userSection}
            icon={faXmark}
          />
        </div>
      );
    } else {
      userSection = (
        <div className={styles.headerIcons}>
          <FontAwesomeIcon
            onClick={showModal}
            className={styles.userSection}
            icon={faUser}
          />
        </div>
      );
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Moment className={styles.date} date={date} format="MMM Do YYYY" />
        <h1 className={styles.title}>The Geeks News</h1>
        {userSection}
      </div>

      <div className={styles.sourcesContainer}>
        {loadingSources || !sources
          ? [...Array(10)].map((_, index) => (
              <div key={index} className={styles.sourceOff}></div>
            ))
          : sources.map(source => {
              const authorizedSources = [
                'the-verge',
                'wired',
                'techradar',
                'techcrunch',
                'recode',
                'ars-technica',
              ];
              if (authorizedSources.includes(source.id)) {
                return (
                  <Tooltip
                    key={source.id}
                    placement="bottom"
                    arrow={false}
                    title={source.description}
                  >
                    <button
                      className={
                        sourceIsSelected(source.id)
                          ? styles.sourceOn
                          : styles.sourceOff
                      }
                      onClick={() => handleSourceClick(source.id)}
                    >
                      {source.name}
                    </button>
                  </Tooltip>
                );
              }
            })}
      </div>

      <div className={styles.linkContainer}>
        <Link href="/">
          <span className={styles.link}>Articles</span>
        </Link>
        <Link href="/bookmarks">
          <span className={styles.link}>Bookmarks</span>
        </Link>
        <Tooltip placement="top" arrow={false} title="Show all masked">
          <FontAwesomeIcon
            onClick={() => dispatch(showAllArticles())}
            icon={faEye}
            className={styles.link}
          />
        </Tooltip>
      </div>

      {isModalVisible && (
        <div id="react-modals">
          <Modal
            getContainer="#react-modals"
            open={isModalVisible}
            onCancel={showModal}
            closable={true}
            footer={null}
          >
            {modalContent}
          </Modal>
        </div>
      )}
    </header>
  );
}

export default Header;
