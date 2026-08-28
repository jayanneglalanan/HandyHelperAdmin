import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BRAND_NAME } from '@shared/utils/constants';

interface BrandContextType {
  brandName: string;
  setBrandName: (name: string) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandName, setBrandName] = useState(BRAND_NAME);

  return (
    <BrandContext.Provider value={{ brandName, setBrandName }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    return { brandName: BRAND_NAME, setBrandName: () => {} };
  }
  return context;
}
