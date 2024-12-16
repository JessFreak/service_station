import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../../../context/UserContext';

const General = () => {
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
        formData,
      );

      setUserData((prevData) => ({ ...prevData, avatarUrl: response.data.data.url }));
      toast.success('Файл завантажено успішно. Збережіть зміни.', {
        position: 'bottom-right',
      });
    } catch (error) {
      toast.error('Помилка завантаження файлу. Будь ласка, спробуйте ще.', {
        position: 'bottom-right',
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/users`, userData, {
        withCredentials: true,
      });
      setUser(response.data);

      toast.success('Дані успішно збережено.', {
        position: 'bottom-right',
      });
    } catch (error) {
      toast.error(`Помилка при збереженні даних. ${error.response.data.message}`, {
        position: 'bottom-right',
      });
    }
  };

  return (
    <>
      <h2 className="profile-title">Ваш профіль</h2>
      <div className="profile-card">
        <div className="profile-section">
          <h3>Загальне</h3>
          <div className="input-container">
            <label htmlFor="name">Ім'я</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ім'я"
              value={userData.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="surname">Прізвище</label>
            <input
              type="text"
              id="surname"
              name="surname"
              placeholder="Прізвище"
              value={userData.surname}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="phone">Номер телефону</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="0686969696"
              value={userData.phone}
              onChange={handleChange}
            />
          </div>
          <button className="red-button save-button" onClick={handleSave}>
            Зберегти
          </button>
        </div>
        <div className="avatar-section">
          <div className="avatar-placeholder">
            <img
              src={userData.avatarUrl || `${process.env.PUBLIC_URL}/user.svg`}
              className="avatar-image"
              alt="Avatar"
              onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/user.svg`)}
            />
          </div>
          <label htmlFor="file-upload" className="red-button">
            Змінити аватар
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </>
  );
};

export default General;