"use client";

import BusinessCard from "@/components/BusinessCard";
import React, { useEffect, useState } from "react";
import { getAllBusinesses, Business } from "@/api/businesses";

export default function Businesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllBusinesses()
      .then(setBusinesses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="w-full flex justify-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="w-full flex justify-center py-8 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-[1240px] flex flex-wrap gap-6 justify-center py-8">
        {businesses.map((business) => (
          <BusinessCard key={business.businessId} business={business} />
        ))}
      </div>
    </div>
  );
}
