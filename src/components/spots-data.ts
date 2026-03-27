import spotResidential from "@/assets/spot-residential-1.jpg";
import spotCityGarage from "@/assets/spot-city-garage-1.jpg";
import spotOffice from "@/assets/spot-office-1.jpg";
import spotUnderground from "@/assets/spot-underground-1.jpg";
import spotShoppingLot from "@/assets/spot-shopping-lot.jpg";
import spotPrivateGarage from "@/assets/spot-private-garage.jpg";

export interface HostProfile {
  name: string;
  avatar: string;
  responseTime: string;
  verified: boolean;
  memberSince: string;
  totalSpots: number;
}

export interface SpotMarker {
  id: string;
  price: number;
  type: "driveway" | "garage" | "lot";
  available: boolean;
  hasEV: boolean;
  hasSecurity: boolean;
  address: string;
  rating: number;
  distance: string;
  lat: number;
  lng: number;
  image?: string;
  host: HostProfile;
}

const spotImages = {
  driveway: spotResidential,
  garage: spotCityGarage,
  lot: spotShoppingLot,
  office: spotOffice,
  underground: spotUnderground,
  privateGarage: spotPrivateGarage,
};

const HOSTS: HostProfile[] = [
  { name: "Erik Lindberg", avatar: "https://i.pravatar.cc/150?img=12", responseTime: "< 5 min", verified: true, memberSince: "2023", totalSpots: 2 },
  { name: "Anna Svensson", avatar: "https://i.pravatar.cc/150?img=5", responseTime: "< 10 min", verified: true, memberSince: "2024", totalSpots: 1 },
  { name: "Lars Johansson", avatar: "https://i.pravatar.cc/150?img=15", responseTime: "< 15 min", verified: false, memberSince: "2024", totalSpots: 3 },
  { name: "Sofia Karlsson", avatar: "https://i.pravatar.cc/150?img=9", responseTime: "< 5 min", verified: true, memberSince: "2022", totalSpots: 4 },
  { name: "Oscar Nilsson", avatar: "https://i.pravatar.cc/150?img=33", responseTime: "< 30 min", verified: true, memberSince: "2025", totalSpots: 1 },
  { name: "Maja Eriksson", avatar: "https://i.pravatar.cc/150?img=25", responseTime: "< 5 min", verified: true, memberSince: "2023", totalSpots: 2 },
];

export const MOCK_SPOTS: SpotMarker[] = [
  { id: "1", price: 2.30, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Storgatan 12, Örebro", rating: 4.8, distance: "2 min walk", lat: 59.2753, lng: 15.2134, image: spotImages.driveway, host: HOSTS[0] },
  { id: "2", price: 3.15, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "Drottninggatan 40, Örebro", rating: 4.9, distance: "4 min walk", lat: 59.2770, lng: 15.2060, image: spotImages.underground, host: HOSTS[1] },
  { id: "3", price: 1.75, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Kungsgatan 8, Örebro", rating: 4.2, distance: "6 min walk", lat: 59.2730, lng: 15.2180, image: spotImages.privateGarage, host: HOSTS[2] },
  { id: "4", price: 4.50, type: "garage", available: false, hasEV: true, hasSecurity: true, address: "Järnvägsgatan 5, Örebro", rating: 4.7, distance: "3 min walk", lat: 59.2790, lng: 15.2110, image: spotImages.garage, host: HOSTS[3] },
  { id: "5", price: 2.85, type: "lot", available: true, hasEV: false, hasSecurity: true, address: "Fabriksgatan 22, Örebro", rating: 4.5, distance: "8 min walk", lat: 59.2710, lng: 15.2050, image: spotImages.office, host: HOSTS[4] },
  { id: "6", price: 1.95, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Rudbecksgatan 15, Örebro", rating: 4.6, distance: "5 min walk", lat: 59.2765, lng: 15.2200, image: spotImages.driveway, host: HOSTS[5] },
  { id: "7", price: 3.40, type: "lot", available: true, hasEV: true, hasSecurity: false, address: "Vasagatan 3, Örebro", rating: 4.3, distance: "7 min walk", lat: 59.2740, lng: 15.2000, image: spotImages.lot, host: HOSTS[0] },
  { id: "8", price: 3.95, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "Trädgårdsgatan 18, Örebro", rating: 4.9, distance: "1 min walk", lat: 59.2760, lng: 15.2150, image: spotImages.garage, host: HOSTS[3] },
  { id: "9", price: 1.50, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Nygatan 25, Örebro", rating: 4.1, distance: "10 min walk", lat: 59.2720, lng: 15.2230, image: spotImages.office, host: HOSTS[2] },
  { id: "10", price: 3.65, type: "lot", available: true, hasEV: false, hasSecurity: true, address: "Engelbrektsgatan 7, Örebro", rating: 4.6, distance: "5 min walk", lat: 59.2800, lng: 15.2080, image: spotImages.underground, host: HOSTS[1] },
  { id: "11", price: 6, type: "driveway", available: true, hasEV: false, hasSecurity: false, address: "Ånäsgatan 14, Örebro", rating: 4.4, distance: "9 min walk", lat: 59.2695, lng: 15.2120, image: spotImages.privateGarage, host: HOSTS[5] },
  { id: "12", price: 15, type: "garage", available: true, hasEV: true, hasSecurity: true, address: "Klostergatan 2, Örebro", rating: 5.0, distance: "2 min walk", lat: 59.2775, lng: 15.2170, image: spotImages.lot, host: HOSTS[3] },
];
