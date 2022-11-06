import React from 'react';
import {greatPlaceStyle, greatPlaceStyleHover} from './MapStyle.js';

// export default class MapPin extends Component {
//export default function MapPin ()  {
const MapPin = ({ onClick, info }) => {
    const [isHovering, setIsHovering] = React.useState(false);

    const handleMouseEnter = () => {
    setIsHovering(true);
    };

    const handleMouseLeave = () => {
    setIsHovering(false);
    };

    const style = isHovering ? greatPlaceStyleHover : greatPlaceStyle;
    return( 
        <div  style={style}  onClick={onClick} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
        {info}
        </div>
    );
}

export default MapPin;