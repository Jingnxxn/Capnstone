import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import allicon from '../../Assets/images/all-icon.png';
import beverageicon from '../../Assets/images/beverage-icon.png';
import fruiticon from '../../Assets/images/fruit-icon.png';
import vegetableicon from '../../Assets/images/vegetable-icon.png';
import meaticon from '../../Assets/images/meat-icon.png';
import HomeIcon from '../../Assets/images/HomeIcon.png';
import SearchIcon from '../../Assets/images/SearchIcon.png';
import CartIcon from '../../Assets/images/CartIcon.png';
import { Product } from '../../types'; // Product 타입을 불러옴
import { IoSearch } from "react-icons/io5";
import axios, { AxiosResponse } from 'axios';
import './Home.css';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

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

  const handleSearch = () => {
    fetchProducts(searchQuery);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim()) {
      navigate(`/Home/Search/${encodeURIComponent(event.target.value.trim())}`);
    } else {
      fetchProducts();
      navigate('/Home');
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const storedCartItems = sessionStorage.getItem('cartItems');
      const parsedItems = storedCartItems ? JSON.parse(storedCartItems) : [];

      const existingProductIndex = parsedItems.findIndex(
        (item: Product) => item.productId === selectedProduct.productId
      );

      if (existingProductIndex !== -1) {
        alert('이미 장바구니에 추가되어 있습니다.');
      } else {
        parsedItems.push(selectedProduct);
        sessionStorage.setItem('cartItems', JSON.stringify(parsedItems));
        console.log('Navigating to Cart with product:', selectedProduct); // 로그 추가
        console.log('Cart items after addition:', parsedItems); // 로그 추가
        console.log('SessionStorage cartItems:', sessionStorage.getItem('cartItems')); // 로그 추가
        
        alert('장바구니에 추가되었습니다.');
      }
      setShowPopup(false);
    }
  };
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const getImagePath = (imageName: string) => {
    return `${process.env.PUBLIC_URL}/product/${imageName}`;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') + '원';
  };

  return (
    <div className="home-container">
      <div className="search-banner">
        <button className="search-icon" onClick={handleSearch}><IoSearch/></button>
        <input
          type="text"
          placeholder="     구매할 상품을 검색하세요"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>

      <div className="no-banner-container">
        <div className="category-icons">
          <button className={`icon-container ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => handleCategoryClick('all')}>
            <img src={allicon} alt="전체" />
            <span>전체</span>
          </button>
          <button className={`icon-container ${selectedCategory === 'fruit' ? 'active' : ''}`} onClick={() => handleCategoryClick('fruit')}>
            <img src={fruiticon} alt="과일" />
            <span>과일</span>
          </button>
          <button className={`icon-container ${selectedCategory === 'vegetable' ? 'active' : ''}`} onClick={() => handleCategoryClick('vegetable')}>
            <img src={vegetableicon} alt="채소" />
            <span>채소</span>
          </button>
          <button className={`icon-container ${selectedCategory === 'meat' ? 'active' : ''}`} onClick={() => handleCategoryClick('meat')}>
            <img src={meaticon} alt="육류" />
            <span>육류</span>
          </button>
          <button className={`icon-container ${selectedCategory === 'beverage' ? 'active' : ''}`} onClick={() => handleCategoryClick('beverage')}>
            <img src={beverageicon} alt="음료" />
            <span>음료</span>
          </button>
        </div>

        <div className="popluar-products-container">
          <div className="section-title">
            <p>전체 상품</p>
          </div>
          <div className="popular-products">
            {filteredProducts.map(product => (
              <div className="product" key={product.productId} onClick={() => handleProductClick(product)}>
                <img src={getImagePath(product.img)} alt={product.productName} />
                <h3>{product.productName}</h3>
                <p>{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPopup && selectedProduct && (
        <div className="product-popup">
          <div className="product-popup-content">
            <h3>{selectedProduct.productName}</h3>
            <p>가격: {formatPrice(selectedProduct.price)}</p>
            <button onClick={handleAddToCart}>장바구니에 담기</button>
            <button onClick={handleClosePopup}>취소</button>
          </div>
        </div>
      )}

      <div className="bottom-icons-banner">
        <div className="bottom-icons">
          <button
            className={`bottom-icon-container`}
            onClick={() => navigate("/Home")}
          >
            <img src={HomeIcon} alt="Icon 1" />
            <span>홈</span>
          </button>
          <button
            className={`bottom-icon-container`}
            onClick={() => navigate("/Search")}
          >
            <img src={SearchIcon} alt="Icon 2" />
            <span>검색</span>
          </button>
          <button
            className={`bottom-icon-container`}
            onClick={() => navigate("/Cart")}
          >
            <img src={CartIcon} alt="Icon 3" />
            <span>장바구니</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

