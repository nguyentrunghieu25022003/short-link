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
  const userId = JSON.parse(localStorage.getItem("user-short-link"))?.id;
  const token = useAuthToken();

  const handleCreateShortenedLink = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!token.userToken) {
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
      const location = await getUserLocation(ip);
      const base64Location = btoa(JSON.stringify(location));
      const imageUrl = `${
        import.meta.env.VITE_API_URL
      }/api/url/track-location/${link.shortId}?data=${base64Location}`;
      const img = new Image();
      img.src = imageUrl;
      document.body.appendChild(img);
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
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleCreateShortenedLink} className="mb-5">
        <div className="mt-3 d-flex align-items-center justify-content-center gap-3">
          <input
            type="text"
            className="form-control fs-4 w-50"
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
            <tr className="fs-3 fw-medium table-dark text-center">
              <th className="text-light">#</th>
              <th className="text-light">Shortened URL</th>
              <th className="text-light">Original URL</th>
              <th className="text-light">Created at</th>
            </tr>
          </thead>
          <tbody>
            {shortenedLinks?.map((link, index) => (
              <tr
                key={index}
                className="fs-4 fw-normal text-dark table-light align-middle"
              >
                <td className="text-center">{index + 1}</td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                  <a
                    href={`${import.meta.env.VITE_API_URL}/${
                      link.shortId
                    }`}
                    target="_blank"
                    className="link-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleGetIPAddressAndLocation(link)}
                  >
                    {import.meta.env.VITE_API_URL}/{link.shortId}
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
                <td className="text-center">{new Date(link.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;