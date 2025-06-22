"use client";

import BusinessCard from "@/components/BusinessCard";
import React, { useEffect, useState } from "react";

interface Business {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  bio: string;
}

export default function Businesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    // Simulate API call, replace with real fetch later
    setBusinesses([
      {
        id: "1",
        businessName: "Acme Corp",
        industry: "Tech",
        location: "New York",
        bio: "We connect students with real-world projects.",
      },
      {
        id: "2",
        businessName: "Beta Solutions",
        industry: "Finance",
        location: "London",
        bio: "Innovative solutions for modern businesses.",
      },
    ]);
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-[1240px] flex flex-wrap gap-6 justify-center py-8">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}
