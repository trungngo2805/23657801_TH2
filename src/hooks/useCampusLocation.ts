// src/hooks/useCampusLocation.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

// Tọa độ cổng KTX cố định trong code (đề yêu cầu)
const KTX_COORDS = { lat: 10.8222, lon: 106.6875 };

export type LocationPermission = 'undetermined' | 'granted' | 'denied' | 'blocked';

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (d: number) => d * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Công thức phí theo VARIANT.shipFormula (A hoặc B) - không hard-code phí cuối
export function calcShipFee(km: number): number {
  return VARIANT.shipFormula === 'A'
    ? BASE_SHIP_FEE + Math.round(km * 2000)
    : BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
}

export function useCampusLocation() {
  // Mặc định CHƯA HỎI: UI phải hiển thị khác với 'granted'
  const [permission, setPermission] = useState<LocationPermission>('undetermined');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const permissionRef = useRef<LocationPermission>('undetermined');

  const updatePermission = useCallback((p: LocationPermission) => {
    permissionRef.current = p;
    setPermission(p);
  }, []);

  // Alert dẫn người dùng tới Cài đặt (Phần 7.5)
  const showBlockedAlert = useCallback(() => {
    Alert.alert(
      'Quyền vị trí đã bị chặn',
      'Bạn đã từ chối quyền vị trí. Hãy vào Cài đặt > KTXGo > Quyền > Vị trí và bật lại để tính phí ship nhé.',
      [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
      ],
    );
  }, []);

  // Lấy toạ độ GPS (chỉ gọi sau khi đã có quyền)
  const fetchPosition = useCallback(() => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (pos) => {
        setDistanceKm(
          getHaversineDistance(
            pos.coords.latitude,
            pos.coords.longitude,
            KTX_COORDS.lat,
            KTX_COORDS.lon,
          ),
        );
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        if (error.code === 1) {
          // PERMISSION_DENIED
          updatePermission('denied');
          return;
        }
        // GPS tắt / timeout / emulator chưa mock toạ độ
        Alert.alert(
          'Không thể lấy vị trí',
          'Vui lòng bật dịch vụ định vị (GPS) trên thiết bị rồi thử lại.',
        );
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  }, [updatePermission]);

  // Hàm gắn vào nút "Lấy vị trí ước tính ship" -> bung hộp thoại hệ thống
  const requestLocation = useCallback(async () => {
    // Đã bị chặn vĩnh viễn: hộp thoại sẽ không bao giờ hiện lại -> mở Cài đặt
    if (permissionRef.current === 'blocked') {
      showBlockedAlert();
      return;
    }

    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Quyền truy cập vị trí',
          message: 'KTXGo cần vị trí của bạn để tính khoảng cách và phí ship.',
          buttonPositive: 'Cho phép',
          buttonNegative: 'Từ chối',
        },
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        updatePermission('granted');
        fetchPosition();
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        updatePermission('blocked');
        showBlockedAlert();
      } else {
        updatePermission('denied'); // vừa từ chối, còn xin lại được
      }
      return;
    }

    // iOS: Pop-up bung theo Info.plist, kết quả trả qua callback
    Geolocation.requestAuthorization(
      () => {
        updatePermission('granted');
        fetchPosition();
      },
      () => {
        // iOS chỉ hỏi 1 lần -> từ chối là blocked
        updatePermission('blocked');
        showBlockedAlert();
      },
    );
  }, [fetchPosition, showBlockedAlert, updatePermission]);

  // Dò quyền HIỆN TẠI mà KHÔNG bung hộp thoại (Android: check() không hiện pop-up)
  const syncPermission = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    const ok = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (ok && permissionRef.current !== 'granted') {
      updatePermission('granted');
      fetchPosition();
    }
  }, [fetchPosition, updatePermission]);

  // Lúc mở màn hình: chỉ đồng bộ trạng thái, KHÔNG tự xin quyền
  useEffect(() => {
    syncPermission();
  }, [syncPermission]);

  // Quay lại từ Cài đặt hệ thống -> dò lại quyền (Phần 7.5)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') syncPermission();
    });
    return () => sub.remove();
  }, [syncPermission]);

  const shipFee = distanceKm !== null ? calcShipFee(distanceKm) : null;

  return { permission, distanceKm, shipFee, loading, requestLocation };
}