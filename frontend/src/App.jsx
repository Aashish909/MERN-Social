import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/userContext";
import Account from "./pages/Account";
import NavigationBar from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import Reels from "./pages/Reels";
import { Loading } from "./components/Loading";
import UserAccount from "./pages/UserAccount";
import Search from "./pages/Search";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const { loading, isAuth, user } = UserData();

  return (
    <div className="h-screen w-screen flex flex-col">
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route path="/reels" element={isAuth ? <Reels /> : <Login />} />
            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route
              path="/user/:id"
              element={isAuth ? <UserAccount user={user} /> : <Login />}
            />
            <Route path="/register" element={!isAuth ? <Register /> : <Home />} />
            <Route path="/login" element={!isAuth ? <Login /> : <Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/chat"
              element={isAuth ? <ChatPage user={user} /> : <Login />}
            />
          </Routes>
          {isAuth && <NavigationBar />}
        </BrowserRouter>
      )}
    </div>
  );
};

export default App;
