import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Address, AddressFormErrors, AddressFormState } from '../address.types';

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
  setCity: (city: string) => void;
  setLng: (lng: number) => void;
  setLat: (lat: number) => void;
  setState: (state: string) => void;
  setErrors: Dispatch<SetStateAction<AddressFormErrors>>;
  setPincodeDirty: (dirty: boolean) => void;
  setCityDirty: (dirty: boolean) => void;
  setStateDirty: (dirty: boolean) => void;
  setNearLandmark: (value: string) => void;
  setFamilyMembersCount: (value: number) => void;
} {
  const [label, setLabel] = useState(address?.label || 'Home');
  const [addressText, setAddressText] = useState(address?.address || '');
  const [pincode, setPincode] = useState(address?.pincode || '');
  const [city, setCity] = useState(address?.location.name || '');
  const [lng, setLng] = useState(address?.lng || 0);
  const [lat, setLat] = useState(address?.lat || 0);
  const [state, setState] = useState(address?.location.state || '');
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [pincodeDirty, setPincodeDirty] = useState(false);
  const [cityDirty, setCityDirty] = useState(false);
  const [stateDirty, setStateDirty] = useState(false);
  const [nearLandmark, setNearLandmark] = useState(address?.nearLandmark || '');
  const [familyMembersCount, setFamilyMembersCount] = useState(
    address?.familyMembersCount || 3,
  );

  useEffect(() => {
    if (address) {
      setLabel(address.label);
      setAddressText(address.address);
      setPincode(address.pincode);
      setLng(address.lng || 0);
      setLat(address.lat || 0);
      setCity(address.location.name);
      setState(address.location.state);
      setNearLandmark(address.nearLandmark || '');
      setFamilyMembersCount(address.familyMembersCount || 3);
    }
  }, [address]);

  return {
    label,
    addressText,
    pincode,
    city,
    lng,
    lat,
    state,
    errors,
    pincodeDirty,
    cityDirty,
    stateDirty,
    nearLandmark,
    familyMembersCount,
    setLabel,
    setAddressText,
    setPincode,
    setCity,
    setLng,
    setLat,
    setState,
    setErrors,
    setPincodeDirty,
    setCityDirty,
    setStateDirty,
    setNearLandmark,
    setFamilyMembersCount,
  };
}
