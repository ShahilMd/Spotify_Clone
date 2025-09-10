import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import Admin from "./pages/Admin";
import {useuserData} from "./context/UserContext.tsx";
import Loading from "./Components/Loding.tsx";

const App = () => {
    const { isAuth, loading } = useuserData();
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/album/:id" element={<Album />} />
                        <Route
                            path="/playlist"
                            element={isAuth ? <PlayList /> : <Login />}
                        />
                        <Route
                            path="/admin/dashboard"
                            element={isAuth ? <Admin /> : <Login />}
                        />
                        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
                        <Route
                            path="/register"
                            element={isAuth ? <Home /> : <Register />}
                        />
                    </Routes>
                </BrowserRouter>
            )}
        </>
    );
};

export default App;