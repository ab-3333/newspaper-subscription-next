"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Subscribe to Our Newspaper
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Start your subscription by entering your delivery address and
          configuring your plan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">📰 Printed</h2>
          <p className="text-gray-600 mb-4">
            Get the newspaper delivered to your address every morning
          </p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            📱 E-Newspaper
          </h2>
          <p className="text-gray-600 mb-4">
            Read the latest edition on your digital devices
          </p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">🌐 Website</h2>
          <p className="text-gray-600 mb-4">
            Get unlimited access to all articles on our website
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => router.push("/delivery-address")}
          className="btn-primary text-lg"
        >
          Start Your Subscription
        </button>
      </div>
    </div>
  );
}
