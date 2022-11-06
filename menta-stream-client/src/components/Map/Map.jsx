import React, { Component } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import GoogleMapReact from "google-map-react";
import "./Map.css";
import { GetNFTWithinRegion, GetNFT } from "server/Database";
import MapPin from "ui-component/MapPin";
import NFTCard from "ui-component/cards/NFTCard";

// GOOGLE MAPS API CREDENTIALS

const GMAPS_API_KEY = process.env.REACT_APP_GMAPS_API_KEY;
const K_HOVER_DISTANCE = 30;
const mapCenter = { lat: 38.91131141655464, lng: -77.04375138092037 };

const loadScript = async () => {
  const loader = new Loader({
    apiKey: GMAPS_API_KEY,
    // version: 'beta',
    id: "__googleMapsScriptId",
    libraries: ["places"],
  });
console.log(loader)
  await loader.load();
  console.log(loader)
};

class Map extends Component {
  state = {
    viewport: {
      center: {
        lat: 37.7749,
        lng: -122.4194,
      },
      zoom: 14,
    },
    googleLoaded: false,
    maps: null,
    popupInfo: null,
    key: null,
  };
  mapRef = React.createRef();

  async componentDidMount() {
    const { locationRef } = this.props;
    try {

      await loadScript();
      this._setCurLocation();
    } catch (e) {
      console.error(`There was an error: ${JSON.stringify(e, null, 2)}`);
      console.log(e);
    }
  }

  _setCurLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this._updateViewport({
          ...this.state.viewport,
          center: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        });
      });
    }
  }

  async _updateViewport(viewport) {
    await this.setState({ viewport });
    await this._updateNFTs(viewport.center);
  }

  async _updateNFTs(center) {
    const { handleAdd } = this.props;
  // const nf = await GetNFTWithinRegion(handleAdd, center, 10);
  }

  _googleMapLoaded = (map, maps) => {
    const { locationRef } = this.props;
    this.setState({ googleLoaded: true });

    this.setState({ maps: maps });
    this.searchBox = new maps.places.SearchBox(locationRef.current); //new google.maps.places.SearchBox(locationRef.current);
    this.searchBox.addListener("places_changed", this._onPlacesChanged);
  };

  _onPlacesChanged = () => {
    const { maps, googleLoaded } = this.state;
    // const {mapRef} = this.props;
    if (!googleLoaded) {
      return;
    }

    var places = this.searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location.
    var bounds = new maps.LatLngBounds(); //google.maps.LatLngBounds();
    var markers = [];

    let map = this.mapRef.current.map_;
    // For each place, get the icon, name and location.
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new maps.Size(71, 71),
        origin: new maps.Point(0, 0),
        anchor: new maps.Point(17, 34),
        scaledSize: new maps.Size(25, 25),
      };

      // Create a marker for each place.
      // markers.push(new google.maps.Marker({
      //     map: map,
      //     icon: icon,
      //     title: place.name,
      //     position: place.geometry.location
      // }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);
  };

  _renderNFTMarker = (nft, index) => {
    return (
      <MapPin
        key={`marker-${index}`}
        lng={nft.location[1]}
        lat={nft.location[0]}
        onClick={() => this._onPinClicked(nft.key)}
        info={nft.key}
      />
    );
  };

  async _onPinClicked(nft) {
    const result = await GetNFT(nft);
    this.setState({ popupInfo: result, key: nft });
  }

  _renderPopup = () => {
    const { popupInfo, key } = this.state;
    // const {user}= this.props;

    return (
      popupInfo && (
        <NFTCard
          info={popupInfo}
          nftID={key}
          onClose={() => this.setState({ popupInfo: null })}
          // isUser={user}
        />
      )
    );
  };

  render() {
    const { viewport, stores, googleLoaded } = this.state;
    const { listNFT } = this.props;

    return (
      <div style={{ height: "80vh", width: "100%" }}>
        <GoogleMapReact
          ref={this.mapRef}
          // bootstrapURLKeys={{ key: GMAPS_API_KEY}}
          bootstrapURLKeys={{
            key: GMAPS_API_KEY,
            libraries: ["places"],
            id: "__googleMapsScriptId",
          }}
          center={viewport.center}
          defaultZoom={14}
          zoom={viewport.zoom}
          onGoogleApiLoaded={({ map, maps }) =>
            this._googleMapLoaded(map, maps)
          } //this.googleMapLoaded(map, maps)}
          yesIWantToUseGoogleMapApiInternals
          hoverDistance={16 / 2}
          hoverDistance={K_HOVER_DISTANCE}
          onChange={({ center, zoom, bounds, marginBounds }) =>
            this._updateViewport({
              ...this.state.viewport,
              center: {
                latitude: center.lat,
                longitude: center.lng,
              },
              zoom: zoom,
            })
          }
        >
          {/* {listNFT && listNFT.map(this._renderNFTMarker)}
          {this._renderPopup()} */}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
