export interface Address {
  id: string;
  label: string;
  streetNumber?: string;
  streetName?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  importance: number;
}

export interface UseAddressSearchResult {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  searchAddresses: (query: string) => Promise<void>;
  clearAddresses: () => void;
}
