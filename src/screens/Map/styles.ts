import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  markerText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
  },
  markerImage: {
    width: 30,
    height: 30
  },
  backButtonContainer: {
  position: 'absolute',
  top: 50,
  left: 20,
  backgroundColor: 'rgba(255,255,255,0.8)',
  padding: 6,
  borderRadius: 8,
  zIndex: 10,
},
});

export default styles;