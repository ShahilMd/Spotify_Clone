import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Album from "./pages/Album";

import { useUserData } from "./context/UserContext.tsx";
import Loading from "./Components/Loding.tsx";
import Layout from "./Components/Layout.tsx";
import MyPlaylist from "./pages/MyPlaylist.tsx";

const App = () => {
    const { isAuth, loading } = useUserData();
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/album/:id" element={<Album />} />
                        <Route
                            path="/playlist"
                            element={isAuth ? <MyPlaylist /> : <Login />}
                        />
                        {/*<Route*/}
                        {/*    path="/admin/dashboard"*/}
                        {/*    element={isAuth ? <Admin /> : <Login />}*/}
                        {/*/>*/}
                        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
                        <Route
                            path="/register"
                            element={isAuth ? <Home /> : <Register />}
                        />
                    </Routes>
                </Layout>
            )}
        </>
    );
};

export default App;
