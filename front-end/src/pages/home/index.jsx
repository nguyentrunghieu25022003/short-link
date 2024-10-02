import { useEffect, useState } from "react";
import { createShortenedLink, getLocation } from "../../api/index";

const Home = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [shortenedLinkData, setShortenedLinkData] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [userLocationInfo, setUserLocationInfo] = useState({});

  const handleCreateShortenedLink = async (event) => {
    event.preventDefault();
    try {
      const shortenedLinkResponse = await createShortenedLink({
        originalUrl: inputUrl,
      });
      const locationResponse = await getLocation({
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
      });

      setShortenedLinkData(shortenedLinkResponse);
      setUserLocationInfo(locationResponse);
      setInputUrl("");
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          setUserCoordinates({
            latitude: geoPosition.coords.latitude,
            longitude: geoPosition.coords.longitude,
          });
        },
        (geoError) => {
          console.error(
            "Error Code: " + geoError.code + " - " + geoError.message
          );
        }
      );
    }
  }, []);

  return (
    <div className="container mt-5">
      <form onSubmit={handleCreateShortenedLink} className="mb-5">
        <div className="mb-3">
          <label htmlFor="inputUrl" className="form-label fs-3">
            Enter the URL to shorten:
          </label>
          <input
            type="text"
            className="form-control fs-4"
            id="inputUrl"
            name="inputUrl"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="URL..."
            required
          />
        </div>
        <button type="submit" className="btn btn-primary fs-3 fw-bold">
          Create Shortened Link
        </button>
      </form>

      {shortenedLinkData && (
        <div className="card">
          <div className="card-header">
            <h3 className="fs-1 fw-bold text-center">Shortened Link Information</h3>
          </div>
          <div className="card-body">
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">Shortened Link:</strong>{" "}
              <a
                href={`https://${shortenedLinkData.shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-primary fs-4"
              >
                {shortenedLinkData.shortUrl}
              </a>
            </p>
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">Title:</strong> {shortenedLinkData.title}
            </p>
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">Description:</strong> {shortenedLinkData.description ? shortenedLinkData.description : "No description"}
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
              <strong className="fs-4 fw-bold">IP:</strong> {userLocationInfo.ip}
            </p>
            <p className="fs-4 lh-lg">
              <strong className="fs-4 fw-bold">Address:</strong>{" "}
              {userLocationInfo.location?.village},{" "}
              {userLocationInfo.location?.city_district},{" "}
              {userLocationInfo.location?.city},{" "}
              {userLocationInfo.location?.country}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;