"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionContext } from "../../context/SubscriptionContext";
import { calculatePrice } from "../../utils/pricing";

export default function Configuration() {
  const router = useRouter();
  const {
    deliveryAddress,
    distanceData,
    localVersions,
    configuration,
    setConfiguration,
    calculatedPrice,
    setCalculatedPrice,
  } = useContext(SubscriptionContext)!;

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!deliveryAddress) {
      router.push("/delivery-address");
    }
  }, [deliveryAddress, router]);

  const distanceKm = distanceData?.distanceKm ?? 0;

  const price = useMemo(() => {
    const result = calculatePrice({
      distanceKm,
      paymentInterval: configuration.paymentInterval,
      subscriptionFrequency: configuration.subscriptionFrequency,
    });
    setCalculatedPrice(result);
    return result;
  }, [
    distanceKm,
    configuration.paymentInterval,
    configuration.subscriptionFrequency,
    setCalculatedPrice,
  ]);

  const handleChange = <K extends keyof typeof configuration>(
    field: K,
    value: (typeof configuration)[K]
  ) => {
    setConfiguration((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    if (!configuration.editionId && localVersions?.length > 0) {
      setLocalError("Please select a local edition.");
      return;
    }
    setLocalError("");
    router.push("/login");
  };

  const today = new Date();
  const minStartDate = new Date(today);
  minStartDate.setDate(today.getDate() + 2);
  const minStartDateStr = minStartDate.toISOString().slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Configure your subscription
      </h1>
      <p className="text-gray-600 mb-6">
        Based on your delivery address, you can select the edition, subscription
        type, payment interval, and start date.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Delivery summary
          </h2>
          <p className="text-sm text-gray-700">
            {deliveryAddress?.firstname} {deliveryAddress?.lastname}
          </p>
          <p className="text-sm text-gray-700">
            {deliveryAddress?.street1}
            {deliveryAddress?.street2 ? `, ${deliveryAddress.street2}` : ""}
          </p>
          <p className="text-sm text-gray-700">
            {deliveryAddress?.plz} {deliveryAddress?.city}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Estimated distance from publisher: {distanceKm.toFixed(1)} km
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Price preview
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            Monthly:{" "}
            <span className="font-semibold">€{price.monthlyPrice}</span>
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Yearly: <span className="font-semibold">€{price.yearlyPrice}</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Final price depends on your payment interval.
          </p>
        </div>
      </div>

      <div className="card space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Subscription type
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            Choose your preferred subscription format.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(["Printed", "E-paper", "Website"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange("aboType", type)}
                className={`border rounded-lg px-4 py-2 text-sm text-left ${
                  configuration.aboType === type
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Local edition
          </h2>
          {localVersions && localVersions.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Choose the local edition for your region.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {localVersions.map((version) => (
                  <button
                    key={version.id}
                    type="button"
                    onClick={() => handleChange("editionId", version.id)}
                    className={`border rounded-lg px-4 py-2 text-sm text-left ${
                      configuration.editionId === version.id
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                  >
                    {version.name}
                  </button>
                ))}
              </div>
              {localError && (
                <p className="text-sm text-red-600 mt-2">{localError}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Standard edition will be used.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Delivery days
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            Daily or weekend delivery?
          </p>
          <div className="flex flex-wrap gap-3">
            {(["Daily", "Weekend"] as const).map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => handleChange("subscriptionFrequency", freq)}
                className={`border rounded-lg px-4 py-2 text-sm ${
                  configuration.subscriptionFrequency === freq
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Payment interval
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            Yearly payments include a discount.
          </p>
          <div className="flex flex-wrap gap-3">
            {(["Monthly", "Annual"] as const).map((interval) => (
              <button
                key={interval}
                type="button"
                onClick={() => handleChange("paymentInterval", interval)}
                className={`border rounded-lg px-4 py-2 text-sm ${
                  configuration.paymentInterval === interval
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              >
                {interval}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Start date
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            First delivery (minimum 2 days from now).
          </p>
          <input
            type="date"
            className="input-field max-w-xs"
            min={minStartDateStr}
            value={configuration.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => router.push("/delivery-address")}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="btn-primary"
          >
            Continue to login
          </button>
        </div>
      </div>
    </div>
  );
}
