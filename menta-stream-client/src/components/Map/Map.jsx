import React, { Component } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import GoogleMapReact from "google-map-react";
import "./Map.css";
import { GetNFTWithinRegion, GetNFT, DistanceBtwePopints } from "server/MentaportSDK";
import MapPin from "ui-component/MapPin";

// GOOGLE MAPS API CREDENTIALS
const GMAPS_API_KEY = process.env.REACT_APP_GMAPS_API_KEY;
const K_HOVER_DISTANCE = 30;
//const mapCenter = { lat: 38.91131141655464, lng: -77.04375138092037 };

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
    popupInfo: false,
    nft: null,
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
    const vp = this.state.viewport;
   
    if(DistanceBtwePopints(vp.center.lat,vp.center.lng,
       viewport.center.lat,viewport.center.lng, 10))
    {
      await this.setState({viewport});
      await this._updateNFTs(viewport.center);
    }
    else {
     // console.log("position almost the same")
    }
  }

  async _updateNFTs(center) {
    const { handleAdd } = this.props;
    const nf = await GetNFTWithinRegion(10000, handleAdd);
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
        onClick={() => this._onPinClicked(nft)}
        info={nft.name}
      />
    );
  };

  async _onPinClicked(nft) {
    const { setNftSelected } = this.props;
   // this.setState({ popupInfo: true, nft: nft });
    setNftSelected(nft);
  }

  // _renderPopup = () => {
  //   const { popupInfo, nft } = this.state;
  //   // const {user}= this.props;
  //   console.log(popupInfo)
  //   return (
  //     popupInfo && (
  //       <NFTCard
  //         nft={nft}
  //         onClose={() => this.setState({ popupInfo: false })}
  //         // isUser={user}
  //       />
  //     )
  //   );
  // };

  render() {
    const { viewport, stores, googleLoaded } = this.state;
    const { listNFT } = this.props;

    return (
      <div style={{ height: "80vh", width: "100%" }}>
        <GoogleMapReact
          ref={this.mapRef}
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
                lat: center.lat,
                lng: center.lng,
              },
              zoom: zoom,
            })
          }
        >
         {listNFT && listNFT.map(this._renderNFTMarker)} 
         {/* {this._renderPopup()} */}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
