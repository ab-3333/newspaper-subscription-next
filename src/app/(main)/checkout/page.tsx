"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionContext } from "../../context/SubscriptionContext";
import type { DeliveryAddress } from "../../context/SubscriptionContext";

export default function Checkout() {
  const router = useRouter();
  const {
    deliveryAddress,
    configuration,
    calculatedPrice,
    billingAddress,
    setBillingAddress,
    paymentDetails,
    setPaymentDetails,
    loginState,
  } = useContext(SubscriptionContext)!;

  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (
      !deliveryAddress ||
      !configuration.startDate ||
      !loginState.isLoggedIn
    ) {
      router.push("/login");
    }
  }, [deliveryAddress, configuration, loginState.isLoggedIn, router]);

  useEffect(() => {
    if (billingSameAsDelivery && deliveryAddress) {
      setBillingAddress({
        firstname: deliveryAddress.firstname,
        lastname: deliveryAddress.lastname,
        street1: deliveryAddress.street1,
        street2: deliveryAddress.street2 || "",
        city: deliveryAddress.city,
        plz: deliveryAddress.plz,
        country: deliveryAddress.country || "Germany",
      });
    }
  }, [billingSameAsDelivery, deliveryAddress, setBillingAddress]);

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev: DeliveryAddress | null) => ({
      ...(prev || {
        firstname: "",
        lastname: "",
        street1: "",
        street2: "",
        city: "",
        plz: "",
        country: "Germany",
      }),
      [name]: value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentDetails((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!billingAddress?.street1?.trim())
      newErrors.billingStreet1 = "Street is required";
    if (!billingAddress?.city?.trim())
      newErrors.billingCity = "City is required";
    if (
      !billingAddress?.plz?.trim() ||
      !/^\d{4,5}$/.test(billingAddress.plz.trim())
    ) {
      newErrors.billingPlz = "Valid postal code is required";
    }

    if (!paymentDetails.accountHolder.trim())
      newErrors.accountHolder = "Account holder is required";
    const iban = paymentDetails.iban.trim().replace(/\s/g, "");
    if (!iban) {
      newErrors.iban = "IBAN is required";
    } else if (!/^DE\d{20}$/.test(iban)) {
      newErrors.iban = "IBAN must be DE followed by 20 digits";
    }

    if (!paymentDetails.mandateAccepted)
      newErrors.mandateAccepted = "You must accept the direct debit mandate";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setErrors({});
    router.push("/thank-you");
  };

  const frequencyLabel =
    configuration.subscriptionFrequency === "Daily"
      ? "Daily delivery"
      : "Weekend delivery";
  const intervalLabel =
    configuration.paymentInterval === "Monthly"
      ? "Billed monthly"
      : "Billed annually";
  const totalPriceLabel =
    configuration.paymentInterval === "Monthly"
      ? `€${calculatedPrice?.monthlyPrice ?? 0} / month`
      : `€${calculatedPrice?.yearlyPrice ?? 0} / year`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">
        Enter billing address and direct debit details, then review your order.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Address */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Billing address
            </h2>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={billingSameAsDelivery}
                onChange={(e) => setBillingSameAsDelivery(e.target.checked)}
              />
              Use delivery address as billing address
            </label>

            {!billingSameAsDelivery && (
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={billingAddress?.firstname || ""}
                      onChange={handleBillingChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={billingAddress?.lastname || ""}
                      onChange={handleBillingChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street and house number *
                  </label>
                  <input
                    type="text"
                    name="street1"
                    value={billingAddress?.street1 || ""}
                    onChange={handleBillingChange}
                    className="input-field"
                  />
                  {errors.billingStreet1 && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.billingStreet1}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address addition
                  </label>
                  <input
                    type="text"
                    name="street2"
                    value={billingAddress?.street2 || ""}
                    onChange={handleBillingChange}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal code *
                    </label>
                    <input
                      type="text"
                      name="plz"
                      value={billingAddress?.plz || ""}
                      onChange={handleBillingChange}
                      className="input-field"
                    />
                    {errors.billingPlz && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.billingPlz}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={billingAddress?.city || ""}
                      onChange={handleBillingChange}
                      className="input-field"
                    />
                    {errors.billingCity && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.billingCity}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={billingAddress?.country || "Germany"}
                    onChange={handleBillingChange}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {billingSameAsDelivery && (
              <p className="text-sm text-gray-500 mt-2">
                Billing address will be identical to your delivery address.
              </p>
            )}
          </div>

          {/* Direct Debit */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment via direct debit
            </h2>
            <p className="text-sm text-gray-600">
              Enter your bank account details
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account holder *
              </label>
              <input
                type="text"
                name="accountHolder"
                value={paymentDetails.accountHolder}
                onChange={handlePaymentChange}
                className="input-field"
              />
              {errors.accountHolder && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.accountHolder}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IBAN *
              </label>
              <input
                type="text"
                name="iban"
                value={paymentDetails.iban}
                onChange={handlePaymentChange}
                className="input-field"
                placeholder="DE00 0000 0000 0000 0000 00"
              />
              {errors.iban && (
                <p className="text-sm text-red-600 mt-1">{errors.iban}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BIC (optional)
              </label>
              <input
                type="text"
                name="bic"
                value={paymentDetails.bic}
                onChange={handlePaymentChange}
                className="input-field"
              />
            </div>

            <label className="inline-flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="mandateAccepted"
                checked={paymentDetails.mandateAccepted}
                onChange={handlePaymentChange}
                className="mt-1 h-4 w-4"
              />
              <span>
                I authorize the publisher to collect payments via direct debit.
              </span>
            </label>
            {errors.mandateAccepted && (
              <p className="text-sm text-red-600 mt-1">
                {errors.mandateAccepted}
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Order summary
            </h2>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{configuration.aboType}</span>{" "}
              subscription
            </p>
            <p className="text-sm text-gray-700">{frequencyLabel}</p>
            <p className="text-sm text-gray-700">{intervalLabel}</p>
            <p className="text-sm text-gray-700">
              Start date: {configuration.startDate || "-"}
            </p>
            <hr className="my-2" />
            <p className="text-sm text-gray-700">Total price:</p>
            <p className="text-xl font-semibold text-gray-900">
              {totalPriceLabel}
            </p>
            <p className="text-xs text-gray-500">
              Price based on delivery address and configuration.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button type="submit" className="btn-primary w-full">
              Confirm order
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="btn-secondary w-full"
            >
              Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
