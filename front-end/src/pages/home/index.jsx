import { useEffect, useState } from "react";
import {
  getAllShortenedLink,
  createShortenedLink,
  getUserIP,
  getUserLocation,
} from "../../api/index";
import Loading from "../../components/loading/index";
import useAuthToken from "../../utils/auth";

const Home = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ip, setIp] = useState(0);
  const userId = JSON.parse(localStorage.getItem("user-short-link"))?.id;
  const userToken = useAuthToken();

  const handleCreateShortenedLink = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!userToken) {
      alert("Please sign in to create shortened links.");
      return;
    }
    try {
      const shortenedLinkResponse = await createShortenedLink(
        { originalUrl: inputUrl },
        userId
      );
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
      setIp(ip);
      const location = await getUserLocation(ip);
      const base64Location = btoa(JSON.stringify(location));
      const imageUrl = `${
        import.meta.env.VITE_API_URL
      }/api/url/track-location/${link.shortId}?data=${base64Location}`;
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mt-5">
      <strong className="fs-2 fw-bold d-block pb-2">IP: {ip}</strong>
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
          <button
            type="submit"
            className="btn btn-primary fs-4 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead>
            <tr className="fs-3 fw-medium table-primary">
              <th className="text-light">#</th>
              <th className="text-light">Shortened Link</th>
              <th className="text-light">Original Link</th>
              <th className="text-light">Created At</th>
            </tr>
          </thead>
          <tbody>
            {shortenedLinks.map((link, index) => (
              <tr
                key={index}
                className="fs-4 fw-normal text-dark table-light align-middle"
              >
                <td>{index + 1}</td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                  <a
                    href={`${import.meta.env.VITE_API_URL}/api/url/shorten/${
                      link.shortId
                    }`}
                    target="_blank"
                    className="link-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleGetIPAddressAndLocation(link)}
                  >
                    {import.meta.env.VITE_API_URL}/api/url/{link.shortId}
                  </a>
                </td>
                <td className="text-truncate" style={{ maxWidth: "250px" }}>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    className="text-decoration-none text-dark"
                  >
                    {link.originalUrl}
                  </a>
                </td>
                <td>{new Date(link.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;