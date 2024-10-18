import PropTypes from "prop-types";
import Header from "../components/header/index";
import Footer from "../components/footer/index";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="pt-5 pb-5 mt-5 mb-5">{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};