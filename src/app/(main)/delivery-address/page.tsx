"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionContext } from "../../context/SubscriptionContext";
import {
  getDistanceFromCompanyToDestinationPlz,
  getLocalVersionsForPlz,
} from "../../../api/Api";
export default function DeliveryAddress() {
  const router = useRouter();
  const {
    deliveryAddress,
    setDeliveryAddress,
    setDistanceData,
    setLocalVersions,
  } = useContext(SubscriptionContext)!;

  const [form, setForm] = useState(
    deliveryAddress || {
      firstname: "",
      lastname: "",
      street1: "",
      street2: "",
      city: "",
      plz: "",
      country: "Germany",
      deliveryNotes: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.firstname.trim()) newErrors.firstname = "First name is required";
    if (!form.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!form.street1.trim()) newErrors.street1 = "Street is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.plz.trim()) newErrors.plz = "Postal code is required";
    if (!/^\d{4,5}$/.test(form.plz.trim()))
      newErrors.plz = "Enter a valid postal code";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setDeliveryAddress(form);

      const distanceResult = await getDistanceFromCompanyToDestinationPlz(
        form.plz
      );
      const distanceObj = distanceResult.distanceCalcObj[0];
      setDistanceData({
        distanceKm: distanceObj?.distance ?? 0,
        plz: distanceObj?.plzDestination ?? form.plz,
      });

      const localVersionsResult = await getLocalVersionsForPlz(form.plz);
      const localVersionsArray = localVersionsResult.localversions || [];
      setLocalVersions(localVersionsArray);

      router.push("/configuration");
    } catch (err) {
      console.error(
        "Error calculating distance or fetching local versions",
        err
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Delivery address
      </h1>
      <p className="text-gray-600 mb-2">
        Enter the address where the printed newspaper should be delivered. Based
        on your postal code, we will calculate the delivery distance and
        available local editions.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        This information is needed to determine the correct subscription price
        and edition for your region.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First name *
            </label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="input-field"
            />
            {errors.firstname && (
              <p className="text-sm text-red-600 mt-1">{errors.firstname}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last name *
            </label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="input-field"
            />
            {errors.lastname && (
              <p className="text-sm text-red-600 mt-1">{errors.lastname}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street and house number *
          </label>
          <input
            type="text"
            name="street1"
            value={form.street1}
            onChange={handleChange}
            className="input-field"
          />
          {errors.street1 && (
            <p className="text-sm text-red-600 mt-1">{errors.street1}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address addition
          </label>
          <input
            type="text"
            name="street2"
            value={form.street2}
            onChange={handleChange}
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
              value={form.plz}
              onChange={handleChange}
              className="input-field"
            />
            {errors.plz && (
              <p className="text-sm text-red-600 mt-1">{errors.plz}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="input-field"
            />
            {errors.city && (
              <p className="text-sm text-red-600 mt-1">{errors.city}</p>
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
            value={form.country}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery notes (optional)
          </label>
          <textarea
            name="deliveryNotes"
            value={form.deliveryNotes}
            onChange={handleChange}
            rows={3}
            className="input-field"
            placeholder="E.g. Leave the paper in the mailbox or in front of the door"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn-secondary"
          >
            Back
          </button>
          <button type="submit" className="btn-primary">
            Continue to configuration
          </button>
        </div>
      </form>
    </div>
  );
}
