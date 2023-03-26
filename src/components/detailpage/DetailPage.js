import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import {
  fetchDetails,
  resetDetails,
} from '../../redux/detailspage/detailSlice';
import HeaderPanel from '../homepage/HeaderPanel';

const DetailPage = () => {
  const { nwId } = useParams();
  const detail = useSelector((state) => state.detail.detail);
  const status = useSelector((state) => state.detail.status);
  const lang = useSelector((state) => state.language.langPack);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === 'loading') {
      dispatch(fetchDetails(nwId));
    }
    return function cleanup() {
      dispatch(resetDetails());
    };
  }, [nwId, status, dispatch]);

  return (
    <>
      <header>
        <HeaderPanel />
      </header>
      <div className="provider-details beige">
        <h2>{detail.city}</h2>
        <h3>{detail.name}</h3>
        <h3>{detail.company}</h3>
      </div>
      <div className="map-container">
        {detail.latitude !== undefined && (
          <MapContainer center={[detail.latitude, detail.longitude]} zoom={13}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {detail.stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.latitude, station.longitude]}
              >
                <Popup>
                  <h2>
                    {lang.station}
                    {station.name}
                  </h2>
                  <h2>
                    {lang.freebikes}
                    {station.free_bikes}
                  </h2>
                  <h2>
                    {lang.emptyslots}
                    {station.empty_slots === null
                      ? ' N/A'
                      : station.empty_slots}
                  </h2>
                  <input
                    className="coordinates"
                    readOnly
                    value={`${station.latitude} , ${station.longitude}`}
                  />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
      {detail.stations.length === 0 && (
        <h2 className="no-data">{lang.nostation}</h2>
      )}
    </>
  );
};

export default DetailPage;
