"use client";
import { useRouter } from "next/navigation";

export default function ThankYou() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-8">✅</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Thank you for your order!
      </h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
        Your newspaper subscription has been successfully recorded. You will
        receive a confirmation email shortly.
      </p>

      <div className="space-y-4 mb-8">
        <button
          onClick={() => router.push("/")}
          className="btn-primary text-lg px-8 py-3"
        >
          ← Back to Homepage
        </button>
        <p className="text-sm text-gray-500">
          Or visit a real news site:{" "}
          <a
            href="https://www.tagesschau.de"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            tagesschau.de
          </a>
        </p>
      </div>

      <div className="text-xs text-gray-400">
        Order ID: #ABO-{Date.now().toString().slice(-6)}
      </div>
    </div>
  );
}
