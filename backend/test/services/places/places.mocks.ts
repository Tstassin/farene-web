import { PlaceData } from "../../../src/client";

export const basePlaceMock: PlaceData = { name: 'Un lieu', description: 'Rue de la rue, 13, 1234 VILLE' };

export const getPlaceMock = (data?: Partial<PlaceData>) => {
  return {
    ...basePlaceMock,
    ...data,
  };
};
