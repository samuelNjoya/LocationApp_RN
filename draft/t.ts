import { useCallback } from 'react';

const addProperty = useCallback((property: PropertyHome) => {
  const newList = [property, ...properties];
  setProperties(newList);
  saveProperties(newList);
}, [properties]);
