import { useState } from "react";
import { createShortenedLink, getLocation } from "../../api/index";

const Home = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [shortenedLinkData, setShortenedLinkData] = useState(null);
  const [userLocationInfo, setUserLocationInfo] = useState({});

  const handleCreateShortenedLink = async (event) => {
    event.preventDefault();
    try {
      const shortenedLinkResponse = await createShortenedLink({
        originalUrl: inputUrl,
      });
      if(shortenedLinkResponse) {
        console.log(shortenedLinkResponse?.shortId)
        const locationResponse = await getLocation(shortenedLinkResponse?.shortId);
        setShortenedLinkData(shortenedLinkResponse);
        setUserLocationInfo(locationResponse);
        setInputUrl("");
      }
    } catch (err) {
      console.log("Error: " + err.message);
    }
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
          <button type="submit" className="btn btn-primary fs-4 fw-bold">Create</button>
        </div>
      </form>
      {shortenedLinkData && (
        <div className="card">
          <div className="card-header bg-primary">
            <h3 className="fs-2 fw-bold text-center text-light">Shortened Link Information</h3>
          </div>
          <div className="card-body">
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">Shortened Link:</strong>{" "}
              <a
                href={`https://${shortenedLinkData?.shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-primary fs-4"
              >
                {shortenedLinkData.shortUrl}
              </a>
            </p>
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">Title:</strong> {shortenedLinkData?.title}
            </p>
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">Description:</strong> {shortenedLinkData?.description ? shortenedLinkData?.description : "No description"}
            </p>
            <div className="d-flex flex-column mt-3">
              <strong className="fs-4 fw-bold">Thumbnail</strong>
              <img
                src={shortenedLinkData.thumbnail}
                alt="Thumbnail"
                className="img-fluid mt-3"
                width="400"
              />
            </div>
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">IP:</strong> {userLocationInfo?.locationInfo?.ip}
            </p>
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">Address:</strong>{" "}
              {userLocationInfo?.locationInfo?.city},{" "}
              {userLocationInfo?.locationInfo?.country}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;