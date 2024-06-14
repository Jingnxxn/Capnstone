import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from "./Pages/Home/Home"; 
import Load from "./Pages/Load/Load";
import Operate from "./Pages/Operate/Operate";
import Search from "./Pages/Search/Search";
import Intro_3 from "./Pages/Intro/Intro_3";
import Intro_2 from "./Pages/Intro/Intro_2";
import Intro_1 from './Pages/Intro/Intro_1';
import Start from './Pages/Start/Start';
import Cart from './Pages/Cart/Cart';
import Map from './Pages/Map/Map';



const App: React.FC = () => {
  const [loading, setLoading] = useState(true); // 로딩 상태를 관리하는 상태 변수 추가

  useEffect(() => {
    // 로딩 상태를 false로 변경하여 Load 페이지를 숨기기
    setLoading(false);
  }, []); // []를 전달하여 이펙트가 마운트될 때만 실행되도록

  return (
      <Routes>
        {loading ? ( // 로딩 중일 때는 Load 페이지를 렌더링
          <Route path="/" element={<Load />} />
        ) : ( // 로딩이 완료된 후에는 Intro 페이지로 이동 
          <>
            <Route path="/" element={<Intro_1 />} />
            <Route path="/Intro_2" element={<Intro_2 />} />
            <Route path="/Intro_3" element={<Intro_3 />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Operate" element={<Operate />} />
            <Route path="/Search" element={<Search />} />
            <Route path="/Start" element={<Start />} />
            <Route path="/Load" element={<Load />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Map" element={<Map />} />
            <Route path="/Home/Search/:productname" element={<Home />} />


          </>
        )}
      </Routes>
  );
}

export default App;
