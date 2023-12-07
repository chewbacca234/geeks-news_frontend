import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { removeAllBookmarks } from '../reducers/bookmarks';
import { showAllArticles } from '../reducers/hiddenArticles';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faEye } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import { Modal, Popover, Tooltip } from 'antd';
import Link from 'next/link';
import { useFetch, useFetchInsideFunction, useForm } from '../hooks';
import { addSource, removeAllSources, removeSource } from '../reducers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const selectedSources = useSelector(state => state.sources);

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
        }
      })
      .finally(() => setIsModalVisible(false));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAllBookmarks());
    dispatch(showAllArticles());
    dispatch(removeAllSources());
  };

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const sourceIsSelected = sourceName =>
    selectedSources.some(source => source === sourceName);

  const handleSourceClick = sourceName => {
    if (sourceIsSelected(sourceName)) {
      dispatch(removeSource(sourceName));
    } else {
      dispatch(addSource(sourceName));
    }
  };

  let modalContent;
  if (!user.isConnected) {
    modalContent = (
      <div className={styles.registerContainer}>
        <div className={styles.registerSection}>
          <p>Sign-up</p>
          <form onSubmit={handleSubmit}>
            {signUpFields.map(field => (
              <input key={field.name} {...field} onChange={handleChange} />
            ))}
            <button type="submit">Register</button>
          </form>
        </div>
        <div className={styles.registerSection}>
          <p>Sign-in</p>
          <form onSubmit={handleSubmit}>
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

  console.log('The Verge is selected ?', sourceIsSelected('The Verge'));
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
          : sources.map(source => (
              <Tooltip
                key={source.id}
                placement="bottom"
                arrow={false}
                title={source.description}
              >
                <button
                  className={
                    sourceIsSelected(source.name)
                      ? styles.sourceOn
                      : styles.sourceOff
                  }
                  onClick={() => handleSourceClick(source.name)}
                >
                  {source.name}
                </button>
              </Tooltip>
            ))}
      </div>

      <div className={styles.linkContainer}>
        <Link href="/">
          <span className={styles.link}>Articles</span>
        </Link>
        <Link href="/bookmarks">
          <span className={styles.link}>Bookmarks</span>
        </Link>
        <FontAwesomeIcon
          onClick={() => dispatch(showAllArticles())}
          icon={faEye}
          className={styles.link}
        />
      </div>

      {isModalVisible && (
        <div id="react-modals">
          <Modal
            getContainer="#react-modals"
            className={styles.modal}
            open={isModalVisible}
            closable={false}
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
