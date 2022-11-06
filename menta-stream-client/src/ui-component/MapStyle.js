const K_SIZE = 40;
const W_SIZE = 150;

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: W_SIZE,
  height: K_SIZE,
  left: -K_SIZE / 2,
  top: -K_SIZE / 2,

  border: '3px solid #898ef5',
  borderRadius: K_SIZE,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#333333',
  fontSize: 13,
  fontWeight: 'bold',
  padding: '8px',
  cursor: 'pointer'
};

const greatPlaceStyleHover = {
  ...greatPlaceStyle,
  border: '3px solid #333333',
  color: '#898ef5'
};

export {greatPlaceStyle, greatPlaceStyleHover, K_SIZE};
