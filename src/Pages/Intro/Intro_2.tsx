import React from 'react';
import { useNavigate } from 'react-router-dom';
import CartImage from '../../Assets/images/ShoppingCart.png'; // 상대 경로 수정
import './Intro.css';

const Intro_2: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="image">
        <img src={CartImage} alt="카트 이미지"></img></div>
        <div className="text-block">
          <h1>함께할 카트를 선택해주세요</h1>
          <p>
            카트에 적힌 고유번호를 입력해<br />
            쇼핑을 함께할 카트를 선택해주세요!
          </p>
          <div className="dots">
            <div className="gray-dot"></div>
            <div className="orange-dot"></div>
            <div className="gray-dot"></div>
          </div>
        </div>
      
      <div className="banner">
        <div className="intro-button-container">
          <button className="skip-button" onClick={() => navigate("/Start")}>건너뛰기</button>
          <button className="next-button" onClick={() => navigate("/Intro_3")}>다음</button>
        </div>
      </div>
    </div>
  );
}

export default Intro_2;
