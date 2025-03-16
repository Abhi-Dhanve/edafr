import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./layouts";
import Home from "./pages/Home";
import NotFound from "./pages/_404"

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout.Default />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
