import React, { useEffect, useState } from 'react';
import './Auth.css';
import GoogleLogo from './GoogleLogo.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/utils';

const Auth = ({ isSignup, setIsSignup }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignup(isSignup);
  }, [isSignup, setIsSignup]);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const userData = { name, surname, email, phone, password };

    const response = await axiosInstance.post('auth/register', userData);
    if (response.error) return;

    toggleForm();
    toast.success('Реєстрація успішна. Ви можете увійти.');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    const response = await axiosInstance.post('auth/login', loginData);
    if (response.error) return;

    const { token } = response.data;
    document.cookie = `access_token=${token};`;
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="auth">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" checked={isSignup} onChange={toggleForm} />
        <div className={isSignup ? 'signup active' : 'signup'}>
          <form onSubmit={handleSignupSubmit}>
            <label htmlFor="chk" aria-hidden="true">Реєстрація</label>
            <input
              className='form-input'
              type="text"
              name="name"
              placeholder="Ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className='form-input'
              type="text"
              name="surname"
              placeholder="Прізвище"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            <input
              className='form-input'
              type="email"
              name="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className='form-input'
              type="tel"
              id="phone"
              name="phone"
              placeholder="0686969696"
              pattern="[0]{1}[0-9]{9}"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              className='form-input'
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-button">Зареєструватись</button>
          </form>
          <div className="google-login">
            <button className="auth-button google" onClick={handleGoogleLogin}>
              <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
              Зареєструватись через Google
            </button>
          </div>
        </div>
        <div className={isSignup ? 'login' : 'login active'}>
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="chk" aria-hidden="true">Вхід</label>
            <input
              className='form-input'
              type="email"
              name="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className='form-input'
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-button">Увійти</button>
          </form>
          <div className="google-login">
            <button className="auth-button google" onClick={handleGoogleLogin}>
              <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
              Увійти через Google
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;
