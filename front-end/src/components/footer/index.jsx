import "./footer.css";

const Footer = () => {
  return (
    <footer className="bg-primary text-light py-4">
      <div className="container text-center">
        <p className="mb-1 fs-4 fw-medium">
          &copy; {new Date().getFullYear()} Short Link. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;