import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from '../../Assets/images/Cart.png'; // 상대 경로 수정
import './Operate.css';
import axios from 'axios';

const Operate: React.FC = () => {
  const navigate = useNavigate();
  /* const [isOperating, setIsOperating] = useState(false); */
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 추가
  const [buttonState, setButtonState] = useState('start'); // 버튼 상태 추가


  useEffect(() => {
    if (buttonState === 'stop') {
      setStartTime(new Date());
    } else {
      setStartTime(null);
    }
  }, [buttonState]);

  // 컴포넌트 언마운트 시 장바구니 초기화
  
    const handleUnload = async () => {
      console.log('Unmounting, clearing cart...');
      try {
        await fetch('http://220.69.240.122:4256/Home/Cart/Shopping/cartselected', {
          method: 'DELETE',
        });
        sessionStorage.removeItem('cartItems');
        console.log('장바구니 초기화 완료');
      } catch (error) {
        console.error('장바구니 초기화 중 오류 발생:', error);
      }
    };

    const handleCartFinish = async () => {
      try {
        const response = await axios.get('http://220.69.240.122:4256/Home/Cart/Shopping/finish/A01', { timeout: 10000 });
        console.log('카트 초기화 완료:', response.data);
      } catch (error) {
        console.error('카트 초기화 중 오류 발생:', error);
        alert('카트를 초기화하는 데 오류가 발생했습니다.');
      }
    };
  

    const handleStart = async () => {
      try {
        const response = await axios.get('http://220.69.240.122:5642/Start', { timeout: 5000 });
        console.log(response.data.message);
        setButtonState('stop');
      } catch (error) {
        console.error('운행 시작 오류:', error);
        alert('운행을 시작하는 데 오류가 발생했습니다.');
      }
    };
  
    const handleReStart = async () => {
      try {
        const response = await axios.get('http://220.69.240.122:5642/Ongoing/run', { timeout: 5000 });
        console.log(response.data.message);
        setButtonState('stop');
      } catch (error) {
        console.error('운행 재시작 오류:', error);
        alert('운행을 시작하는 데 오류가 발생했습니다.');
      }
    };
  
    const handleTempStop = async () => {
      try {
        const response = await axios.get('http://220.69.240.122:5642/Ongoing/tempstop', { timeout: 5000 });
        console.log(response.data.message);
        setButtonState('restart');
      } catch (error) {
        console.error('운행 정지 오류:', error);
        alert('운행을 정지하는 데 오류가 발생했습니다.');
      }
    };
  
    const handleStop = async () => {
      try {
        const response = await axios.get('http://220.69.240.122:5642/Ongoing/stop', { timeout: 5000 });
        console.log(response.data.message);
        navigate('/Start');
      } catch (error) {
        console.error('운행 종료 오류:', error);
        alert('운행을 종료하는 데 오류가 발생했습니다.');
      }
    };

  const calculateElapsedTime = () => {
    if (startTime) {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const minutes = Math.floor(elapsed / 60000); // 60000으로 수정
      const seconds = Math.floor((elapsed % 60000) / 1000); // 60000으로 수정
      return `${minutes}분 ${seconds}초`;
    }
    return '0분 0초';
  };

  const handleStopClick = () => {
    setShowPopup(true); // 팝업 표시
  };

  const handleClosePopup = () => {
    setShowPopup(false); // 팝업 닫기
  };

  const handleConfirmStop = async () => {
    await handleStop();
    setShowPopup(false);
  };
  
  const handleBack = async () => {
      navigate('/Cart');
      await Promise.all([
        handleUnload(),  // 장바구니 초기화
        handleCartFinish()  // 카트 초기화
      ]);
      
    
  };

  return (
    <div className="operate-container">
      <button className='back-button' onClick={handleBack}>←</button>
      <div className="user-location-icon" />
      <div className="operate-banner">
        <div className="cart-info">
          <img src={Cart} alt="Cart" />
          <div className="cart-details">
            <div className="time">진행 시간: {calculateElapsedTime()}</div>
            <span className="cart-number">A13789</span>
            <span className="cart-status">사용 가능</span>
          </div>
        </div>
        <div className="controls">
        <div className="operate-buttons">
            {buttonState === 'start' && (
              <button className="start-button" onClick={handleStart}>시작</button>
            )}
            {buttonState === 'stop' && (
              <button className="stop-button" onClick={handleTempStop}>정지</button>
            )}
            {buttonState === 'restart' && (
              <button className="start-button" onClick={handleReStart}>재시작</button>
            )}
            <button className="end-button" onClick={handleStopClick}>종료</button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="operate-popup-overlay">
          <div className="operate-popup">
            <button className="close-button" onClick={handleClosePopup}></button>
            <p>운행을 종료하시겠습니까?</p>
            <div className="operate-popup-buttons">
              <button className="confirm-button" onClick={handleConfirmStop}>예</button>
              <button className="cancel-button" onClick={handleClosePopup}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Operate;
