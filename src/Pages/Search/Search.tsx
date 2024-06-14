import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import { IoSearch } from 'react-icons/io5';
import HomeIcon from '../../Assets/images/HomeIcon.png';
import SearchIcon from '../../Assets/images/SearchIcon.png';
import CartIcon from '../../Assets/images/CartIcon.png';
import { Product } from '../../types';
import axios from 'axios';


const Search: React.FC = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [displayResults, setDisplayResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);


  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') + '원';
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('검색할 상품의 이름을 입력해주세요.'); // 알림 메시지 설정
      return;
    }
    setDisplayResults(searchResults);
  };

  const handleInputClick = () => {
    setDisplayResults([]);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim()) {
      const results = products.filter(product =>
        product.productName.includes(event.target.value.trim())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (productName: string) => {
    const selectedProduct = products.filter(product =>
      product.productName === productName
    );
    setSearchQuery(productName);
    setSearchResults([]);
    setDisplayResults(selectedProduct);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = (query: string = '') => {
    const url = query
      ? `http://220.69.240.122:4256/Home/Search/${encodeURIComponent(query.trim())}`
      : `http://220.69.240.122:4256/Start/Home`;

    axios.get<Product[]>(url)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const storedCartItems = sessionStorage.getItem('cartItems');
      const parsedItems = storedCartItems ? JSON.parse(storedCartItems) : [];
      parsedItems.push(selectedProduct);
      sessionStorage.setItem('cartItems', JSON.stringify(parsedItems));
      console.log('Navigating to Cart with product:', selectedProduct); // 로그 추가
      console.log('Cart items after addition:', parsedItems); // 로그 추가
      console.log('SessionStorage cartItems:', sessionStorage.getItem('cartItems')); // 로그 추가
      setShowPopup(false);
      alert('장바구니에 추가되었습니다.');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
  };
 
  return (
    <div className="home-container">
      {/* 오렌지색 배너 */}
      <div className="search-banner">
            <button className="search-icon" onClick={handleSearch}><IoSearch/></button>
          <input 
            type="text"    
            placeholder="     구매할 상품을 검색하세요"
            value={searchQuery}
            onChange={handleSearchInputChange} 
            onClick={handleInputClick}
            />
          
      </div>

      

      <div className="no-banner-container">
        {(!searchQuery && displayResults.length ===0) && (
          <p className='placeholder-text'>상품을 검색해주세요</p>
        )}

        {searchQuery && !displayResults.length && (
          <ul className="search-results">
            {searchResults.map((product) => (
              <li 
              key={product.productId} 
              className="search-result-item"
              onClick={() => handleResultClick(product.productName)}
              >
                {product.productName}
                
              </li>
            ))}
            {searchResults.length === 0 && (
              <p className="no-results">검색된 상품이 없습니다</p>
            )}
          </ul>
        )}

        {displayResults.length > 0 && (
          <div className="product-list">
            {displayResults.map((product) => (
              <div key={product.productId} className="product-item" onClick={() => handleProductClick(product)}>
                <img src={`${process.env.PUBLIC_URL}/product/${product.img}`} alt={product.productName} />
                <div className="product-details">
                  <h4>{product.productName}</h4>
                  <p>{product.price.toLocaleString('ko-KR')}원</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        
      {showPopup && selectedProduct && (
        <div className="product-popup">
          <div className="product-popup-content">
            <h2>{selectedProduct.productName}</h2>
            <p>가격: {formatPrice(selectedProduct.price)}</p>
            <button onClick={handleAddToCart}>장바구니에 담기</button>
            <button onClick={handleClosePopup}>취소</button>
          </div>
        </div>
      )}

        

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
    
  );
};

export default Search; 
