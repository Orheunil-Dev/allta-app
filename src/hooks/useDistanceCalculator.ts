import { useCallback } from "react";

export const useDistanceCalculator = () => {
  const getDistance = useCallback(
    (
      currentLat: number,
      currentLng: number,
      storeLat: number,
      storeLng: number
    ): string => {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const R = 6371;
      const diffLat = toRad(storeLat - currentLat);
      const diffLng = toRad(storeLng - currentLng);

      const haversine =
        Math.sin(diffLat / 2) ** 2 +
        Math.cos(toRad(currentLat)) *
          Math.cos(toRad(storeLat)) *
          Math.sin(diffLng / 2) ** 2;

      const angularDistance =
        2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

      const distance = R * angularDistance;

      return distance.toFixed(1);
    },
    []
  );

  return { getDistance };
};
