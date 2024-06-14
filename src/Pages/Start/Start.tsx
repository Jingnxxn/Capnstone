import React, {useState} from 'react';
import StartImage from '../../Assets/images/Cart.png'; // 상대 경로 수정
import { useNavigate } from 'react-router-dom';
import './Start.css';

const Start: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container-start">
      <div className="ASAP-start">
        <h1>
          <span>A</span>
          <span>SAP</span>
        </h1>
        </div>
        <div className="text">
        <p>편리하고 빠른 쇼핑</p>

        </div>
      
      <div className="Car-image">
        <img src={StartImage} alt="쇼핑 이미지" />
      </div>
      
      <div className="start-button-container">
        <button className="single-shopping" onClick={() => navigate("/Map")}>혼자서 쇼핑</button>
        <button className="shopping-with-asap" onClick={() => navigate("/Home")}>에이셉과 함께 쇼핑</button>
      </div>
   
    </div>
  );
}

export default Start;
