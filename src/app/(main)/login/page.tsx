"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionContext } from "../../context/SubscriptionContext";

export default function Login() {
  const router = useRouter();
  const { deliveryAddress, configuration, loginState, setLoginState } =
    useContext(SubscriptionContext)!;
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!deliveryAddress || !configuration.startDate) {
      router.push("/delivery-address");
    }
  }, [deliveryAddress, configuration, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginState((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!loginState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(loginState.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!loginState.password.trim()) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setLoginState((prev: any) => ({ ...prev, isLoggedIn: true }));
    router.push("/checkout");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Login / Registration
      </h1>
      <p className="text-gray-600 mb-6">
        Enter your email and password to continue to checkout.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={loginState.email}
            onChange={handleChange}
            className="input-field"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={loginState.password}
            onChange={handleChange}
            className="input-field"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => router.push("/configuration")}
            className="btn-secondary"
          >
            Back
          </button>
          <button type="submit" className="btn-primary">
            Continue to checkout
          </button>
        </div>
      </form>
    </div>
  );
}
