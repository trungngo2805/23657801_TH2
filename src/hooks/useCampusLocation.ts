import { useState, useEffect, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const KTX_COORDS = { lat: 10.8222, lon: 106.6875 }; // Toạ độ KTX giả định (IUH)

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function useCampusLocation() {
  const [permission, setPermission] = useState<'undetermined' | 'granted' | 'denied' | 'blocked'>('undetermined');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const requestLocation = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setPermission('blocked'); return;
      }
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setPermission('denied'); return;
      }
    } else {
      Geolocation.requestAuthorization();
    }
    
    setPermission('granted');
    Geolocation.getCurrentPosition(
      (pos) => {
        const km = getHaversineDistance(pos.coords.latitude, pos.coords.longitude, KTX_COORDS.lat, KTX_COORDS.lon);
        setDistanceKm(km);
      },
      (error) => console.log('Lỗi GPS:', error),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => { requestLocation(); }, [requestLocation]);

  return { permission, distanceKm, requestLocation };
}