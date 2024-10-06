import { useEffect, useState } from "react";
import { getAllShortenedLink, createShortenedLink, getUserIP, getUserLocation } from "../../api/index";
import Loading from "../../components/loading/index";

const Home = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user-short-link"))?.id;

  const handleCreateShortenedLink = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const shortenedLinkResponse = await createShortenedLink({ originalUrl: inputUrl }, userId);
      if (shortenedLinkResponse) {
        setInputUrl("");
        setIsRefreshing(!isRefreshing);
      }
    } catch (err) {
      console.log("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetIPAddressAndLocation = async (link) => {
    try {
      const ip = await getUserIP();
      const location = await getUserLocation(ip);
      const base64Location = btoa(JSON.stringify(location));
      const imageUrl = `${import.meta.env.VITE_API_URL}/api/url/track-location/${link.shortId}?data=${base64Location}`;
      const img = new Image();
      img.src = imageUrl;
      document.body.appendChild(img);
      console.log("Get IP address and location successfully !");
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await getAllShortenedLink();
        setShortenedLinks(response);
      } catch (err) {
        console.log("Error fetching: " + err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId, isRefreshing]);

  if(isLoading) {
    return <Loading />;
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleCreateShortenedLink} className="mb-5">
        <label htmlFor="inputUrl" className="form-label fs-4">
          Enter the URL to shorten:
        </label>
        <div className="mt-3 d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control fs-4 w-100"
            id="inputUrl"
            name="inputUrl"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="URL..."
            required
          />
          <button type="submit" className="btn btn-primary fs-4 fw-bold" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="fs-3 fw-medium text-dark table-dark">
            <th>#</th>
            <th>Shortened Link</th>
            <th>Original Link</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {shortenedLinks.map((link, index) => (
            <tr key={index} className="fs-4 fw-normal text-dark table-light align-middle">
              <td>{index + 1}</td>
              <td>
                <a
                  href={`${import.meta.env.VITE_API_URL}/api/url/redirect/${link.shortId}`}
                  target="_blank"
                  className="link-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleGetIPAddressAndLocation(link)}
                >
                  {import.meta.env.VITE_API_URL}/{link.shortId}
                </a>
              </td>
              <td className="text-truncate" style={{ maxWidth: "450px" }}>
                <a href={link.originalUrl} target="_blank" className="text-decoration-none text-dark">{link.originalUrl}</a>
              </td>
              <td>{new Date(link.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;