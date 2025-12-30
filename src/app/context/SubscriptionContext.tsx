"use client";
import React, { createContext, useState, ReactNode } from "react";

export interface DeliveryAddress {
  firstname: string;
  lastname: string;
  street1: string;
  street2?: string;
  city: string;
  plz: string;
  country?: string;
  deliveryNotes?: string;
}

interface Configuration {
  aboType: "Printed" | "E-paper" | "Website";
  subscriptionFrequency: "Daily" | "Weekend";
  paymentInterval: "Monthly" | "Annual";
  editionId: number | null;
  startDate: string;
}

interface CalculatedPrice {
  monthlyPrice: number;
  yearlyPrice: number;
}

interface SubscriptionContextType {
  deliveryAddress: DeliveryAddress | null;
  setDeliveryAddress: React.Dispatch<DeliveryAddress | null>;
  configuration: Configuration;
  setConfiguration: React.Dispatch<React.SetStateAction<Configuration>>;
  distanceData: { distanceKm: number; plz: string } | null;
  setDistanceData: React.Dispatch<{ distanceKm: number; plz: string } | null>;
  localVersions: Array<{ id: number; name: string }> | [];
  setLocalVersions: React.Dispatch<Array<{ id: number; name: string }> | []>;
  calculatedPrice: CalculatedPrice | null;
  setCalculatedPrice: React.Dispatch<CalculatedPrice | null>;
  billingAddress: DeliveryAddress | null;
  setBillingAddress: React.Dispatch<
    React.SetStateAction<DeliveryAddress | null>
  >;
  paymentDetails: {
    accountHolder: string;
    iban: string;
    bic: string;
    mandateAccepted: boolean;
  };
  setPaymentDetails: React.Dispatch<React.SetStateAction<any>>;
  loginState: {
    isLoggedIn: boolean;
    email: string;
    password: string;
  };
  setLoginState: React.Dispatch<React.SetStateAction<any>>;
}

export const SubscriptionContext =
  createContext<SubscriptionContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: Props) {
  const [deliveryAddress, setDeliveryAddress] =
    useState<DeliveryAddress | null>(null);
  const [configuration, setConfiguration] = useState<Configuration>({
    aboType: "Printed",
    subscriptionFrequency: "Daily",
    paymentInterval: "Monthly",
    editionId: null,
    startDate: "",
  });
  const [distanceData, setDistanceData] = useState<{
    distanceKm: number;
    plz: string;
  } | null>(null);
  const [localVersions, setLocalVersions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [calculatedPrice, setCalculatedPrice] =
    useState<CalculatedPrice | null>(null);
  const [billingAddress, setBillingAddress] = useState<DeliveryAddress | null>(
    null
  );
  const [paymentDetails, setPaymentDetails] = useState({
    accountHolder: "",
    iban: "",
    bic: "",
    mandateAccepted: false,
  });
  const [loginState, setLoginState] = useState({
    isLoggedIn: false,
    email: "",
    password: "",
  });

  return (
    <SubscriptionContext.Provider
      value={{
        deliveryAddress,
        setDeliveryAddress,
        configuration,
        setConfiguration,
        distanceData,
        setDistanceData,
        localVersions,
        setLocalVersions,
        calculatedPrice,
        setCalculatedPrice,
        billingAddress,
        setBillingAddress,
        paymentDetails,
        setPaymentDetails,
        loginState,
        setLoginState,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
