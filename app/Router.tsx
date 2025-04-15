import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./layouts";
import NotFound from "./pages/_404";
import Home from "./pages/Home";
import Register from "./pages/Register";
import History from "./pages/History";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";






export default function () {
 
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout.Default />}>
          <Route path="home" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="history" element={<History />} />
          <Route path="admin" element={<Admin />} />
          <Route path="unauthorized" element={<Unauthorized />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
