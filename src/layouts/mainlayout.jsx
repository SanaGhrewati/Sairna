import Header from "../components/header/header"
import Footer from "../components/footer/footer"
import ScrollToTop from "../components/scroll-to-top/scroll-to-top"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout