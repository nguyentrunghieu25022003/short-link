import PropTypes from "prop-types";
import Header from "../components/header/index";

const DefaultLayout = ({ children }) => {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
        </>
    );
};

export default DefaultLayout;