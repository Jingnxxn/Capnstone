import React from 'react';
import { useNavigate } from 'react-router-dom';
import productImage from '../../Assets/images/product.png';
import './Intro.css';

const Intro_1: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="image">
        <img src={productImage} alt="상품 이미지" /></div>
        <div className="text-block">
          <h1>구매할 상품을 담아주세요</h1>
          <p>
            원하는 상품을 검색해서<br />
            장바구니에 담아주세요!
          </p>
          <div className="dots">
            <div className="orange-dot"></div>
            <div className="gray-dot"></div>
            <div className="gray-dot"></div>
          </div>
        </div>
      
      <div className="banner">
        <div className="intro-button-container">
          <button className="skip-button" onClick={() => navigate("/Start")}>건너뛰기</button>
          <button className="next-button" onClick={() => navigate("/Intro_2")}>다음</button>
        </div>
      </div>
    </div>
  );
}

export default Intro_1;
