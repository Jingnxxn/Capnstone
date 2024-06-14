import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../../Assets/images/HomeIcon.png';
import SearchIcon from '../../Assets/images/SearchIcon.png';
import CartIcon from '../../Assets/images/CartIcon.png';
import { Product } from '../../types'; // Product 타입을 불러옴
import './Cart.css';
import axios from 'axios';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [cartid, setcartid] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});


  useEffect(() => {
    // 세션 스토리지에서 카트 아이템을 불러옴
    const storedCartItems = sessionStorage.getItem('cartItems');
    if (storedCartItems) {
      const parsedItems = JSON.parse(storedCartItems) as Product[];
      console.log('Loaded cart items from sessionStorage:', parsedItems); // 추가된 로그
      setCartItems(parsedItems);
      const initialQuantities = parsedItems.reduce((acc, item) => {
        acc[item.productId] = 1;
        return acc;
      }, {} as { [key: string]: number });
      setQuantities(initialQuantities);
    } else {
      console.log('No cart items found in sessionStorage');
    }
  }, []); // 빈 배열을 두 번째 인수로 전달하여 이 효과가 한 번만 실행

  useEffect(() => {
    console.log('카트아이템', cartItems);
    // 카트 아이템이 변경될 때마다 세션 스토리지에 저장
    if (cartItems.length > 0) {
      sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log('Updated sessionStorage cartItems:', sessionStorage.getItem('cartItems')); // 로그 추가
    }
  }, [cartItems]); // cartItems가 변경될 때마다 이 효과가 실행

  

  const sendCartItemsToServer = async () => {
    try {
      await Promise.all(cartItems.map(async (item) => {
        const response = await axios.post(`http://220.69.240.122:4256/Home/Search/add/${item.productId}`, {
          productId: item.productId
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 3000 // 타임아웃 설정 (3sc)
        });

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        console.log('Success:', response.data);
      }));
      alert('장바구니 상품이 서버로 전송되었습니다.');
    } catch (error) {
      console.error('Error sending cart items:', error);
      alert('장바구니 상품 전송에 실패했습니다.');
    }
  };


  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    sessionStorage.setItem('cartItems', JSON.stringify(updatedCart)); // 세션 스토리지 업데이트
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[productId];
    setQuantities(updatedQuantities);
  }; // 장바구니 상품 삭제

  const increaseQuantity = (productId: string) => {
    setQuantities({
      ...quantities,
      [productId]: (quantities[productId] || 1) + 1
    });
  };

  const decreaseQuantity = (productId: string) => {
    if (quantities[productId] > 1) {
      setQuantities({
        ...quantities,
        [productId]: quantities[productId] - 1
      });
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * (quantities[item.productId] || 1), 0).toLocaleString('ko-KR');
  }; // 총 가격 계산

  const handleGoShopping = () => {
    if (cartItems.length === 0) {
      alert('장바구니에 상품을 담아주세요.');
      return;
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const checkCartAvailability = async (cartid: string) => {
    try {
      console.log(`아이이췤:${cartid}`);
      const response = await fetch(`http://220.69.240.122:4256/Home/Cart/Shopping/${cartid}`, {
        method: 'GET'
      });
      console.log(`응답상태: ${response.status}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('카트 가능데이터', data);


      // 수정된 부분: data 배열을 확인하고 isUsed 값을 확인합니다.
    if (Array.isArray(data) && data.length > 0) {
      console.log(`Cart is ${data[0].isUsed === 0 ? 'available' : 'in use'}`);
      return data[0].isUsed === 0;
    } else {
      console.log('Data is not an array or is empty');
      // data가 배열이 아니거나 빈 배열인 경우 false 반환
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
  };

  const startShopping = async (cartid: string): Promise<boolean> => {
    try {
      console.log('Starting shopping with cartid:', cartid); // 추가된 로그
      const response = await fetch(`http://220.69.240.122:4256/Home/Cart/Shopping/start/${cartid}`, {
        method: 'GET',
        mode: 'cors'
      },);
  
      console.log('Fetch response:', response); // 추가된 로그
  
      if (!response.ok) {
        console.log('Fetch response not OK:', response.status); // 추가된 로그
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
  
      const responseText = await response.text();
      console.log('Start shopping response text:', responseText); // 추가된 로그
  
      if (!responseText) {
        console.log('Empty response text'); // 추가된 로그
        return false;
      }
  
      try {
        const data = JSON.parse(responseText);
        console.log('Parsed response data:', data); // 추가된 로그
  
        const success = data.success !== undefined ? data.success : data;
        console.log('Start shopping success:', success); // 추가된 로그
        return !!success; // success를 boolean으로 변환하여 반환
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError); // 추가된 로그
        return false;
      }
    } catch (error) {
      console.error('Error in startShopping:', error); // 추가된 로그
      return false;
    }
  };
  

  
  const handlecartidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcartid(e.target.value);
  };

const handleConfirm = async () => {
    if (!cartid) {
      alert('카트 번호를 입력해주세요.');
      return;
    }

    const isAvailable = await checkCartAvailability(cartid);
    console.log('Cart availability:', isAvailable); // 추가된 로그
    if (!isAvailable) {
      alert('이미 사용중입니다');
      return;
    }

    console.log('Before starting shopping');
    try {
      const started = await startShopping(cartid);
      console.log('Started shopping:', started);
      if (started) {
        console.log('Before sending cart items to server');
        await Promise.all(cartItems.map(async (item) => {
          await sendCartItemsToServer();
          console.log(`Sent item ${item.productId} to server`);
        })); // 장바구니 아이템 서버로 전송
        console.log('After sending cart items to server');
        setShowPopup(false);
        console.log('Popup closed');
        console.log('Navigating to /Operate');
        navigate('/Operate'); // 여기서 navigate를 호출합니다.
      } else {
        console.log('Start shopping failed:', started);
        alert('카트 사용 시작에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error in handleConfirm:', error);
    }
  };
  
  
  
  
  
  

  return (
    <div className="cart-container">
      {/* 장바구니 상품 목록 */}
      <div className="no-banner-cart-container">
  <div className="cart-items">
    {cartItems.map((item) => (
      <div className="cart-item" key={item.productId}>
        <img src={`${process.env.PUBLIC_URL}/product/${item.img}`} alt={item.productName} />
        <div className="item-details">
          <h4>{item.productName}</h4>
          <p>원산지 : 국산</p>
          <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.productId)}>-</button>
                  <span>{quantities[item.productId]}</span>
                  <button onClick={() => increaseQuantity(item.productId)}>+</button>
                </div>
              </div>
              <h5 className="item-price">{((item.price || 0) * (quantities[item.productId] || 1)).toLocaleString('ko-KR')}원</h5>
              <button className="remove-item" onClick={() => removeFromCart(item.productId)}>x</button>
            </div>
          ))}
        </div>



        {/* 총 가격 */}
        <div className="total-price">
          <p>합계: {calculateTotalPrice()}원</p>
        </div>
        <button className="shopping-button" onClick={handleGoShopping}>
          쇼핑하러 가기
        </button>
      </div>

      {/* 팝업창 */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button onClick={handleClosePopup}>x</button>
            <input
              type="text"
              value={cartid}
              onChange={handlecartidChange}
              placeholder=" 예) A13789 "
            />
            <h4>카트 번호를 입력해주세요</h4>
            <button onClick={handleConfirm}>확인</button>
          </div>
        </div>
      )}

      <div className="Cart-container">
        {/* 하단 아이콘 세트 */}
        <div className="bottom-icons-banner">
          <div className="bottom-icons">
            <button className="bottom-icon-container" onClick={() => navigate("/Home")}>
              <img src={HomeIcon} alt="Icon 1" />
              <span>홈</span>
            </button>

            <button className="bottom-icon-container" onClick={() => navigate("/Search")}>
              <img src={SearchIcon} alt="Icon 2" />
              <span>검색</span>
            </button>

            <button className="bottom-icon-container" onClick={() => navigate("/Cart")}>
              <img src={CartIcon} alt="Icon 3" />
              <span>장바구니</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
