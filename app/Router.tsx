import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./layouts";
import NotFound from "./pages/_404";
import Home from "./pages/Home";
import Register from "./pages/Register";
import History from "./pages/History";

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout.Default />}>
          <Route path="home" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="history" element={<History />} />

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
