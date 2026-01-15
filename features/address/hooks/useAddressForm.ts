import { useEffect, useState } from 'react';
import { Address, AddressFormState } from '../types';

/**
 * Custom hook for managing address form state.
 * Handles initialization from existing address and provides state setters.
 *
 * @param address - Optional existing address to initialize form state
 * @returns Object containing form state and setters
 */
export function useAddressForm(address?: Address): AddressFormState & {
  setLabel: (label: string) => void;
  setAddressText: (addressText: string) => void;
  setPincode: (pincode: string) => void;
  setCityId: (cityId: string) => void;
  setLng: (lng: number) => void;
  setLat: (lat: number) => void;
  setState: (state: string) => void;
} {
  const [label, setLabel] = useState(address?.label || 'Home');
  const [addressText, setAddressText] = useState(address?.address || '');
  const [pincode, setPincode] = useState(address?.pincode || '');
  const [cityId, setCityId] = useState(address?.city?.id || '');
  const [lng, setLng] = useState(address?.location?.lng || 0);
  const [lat, setLat] = useState(address?.location?.lat || 0);
  const [state, setState] = useState('');

  useEffect(() => {
    if (address) {
      setLabel(address.label);
      setAddressText(address.address);
      setPincode(address.pincode);
      setCityId(address.city?.id || '');
      setLng(address.location?.lng || 0);
      setLat(address.location?.lat || 0);
    }
  }, [address]);

  return {
    label,
    addressText,
    pincode,
    cityId,
    lng,
    lat,
    state,
    setLabel,
    setAddressText,
    setPincode,
    setCityId,
    setLng,
    setLat,
    setState,
  };
}
