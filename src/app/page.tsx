"use client";
import FilterJobs from "@/components/Filters/FilterJobs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllJobs, Job } from "@/api/jobs";
import { getAllBusinesses, Business } from "@/api/businesses";

export default function Home() {
  const [offset, setOffset] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    getAllJobs()
      .then(async (jobs) => {
        // Fetch all businesses to map businessId to name
        const businesses = await getAllBusinesses();
        setBusinesses(businesses);
        // Map businessName into jobs
        setJobs(
          jobs.map((job) => ({
            ...job,
            businessName:
              businesses.find((b) => b.businessId === job.createdBy)?.name ||
              job.createdBy,
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[60vh] overflow-hidden left-1/2 right-1/2 -mx-[50vw] max-w-none">
        <div
          className="absolute inset-0 w-full h-[120%] top-[-10%]"
          style={{
            transform: `translateY(${-40 + offset * 0.3}px)`,
            willChange: "transform",
          }}
        >
          <Image
            src="/images/HeroImage.jpg"
            alt="Hero Image"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Optional overlay content */}
        <div className="absolute font-bold inset-0 flex items-center justify-center text-white text-3xl bg-black/50 flex-col space-y-4 text-center">
          <h1>
            Welcome to{" "}
            <span className="shadow italic underline">SkillsMatch</span>
            <br />
            The one stop solution for student - business matching
          </h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="bg-blue-500 text-white px-4 py-2 rounded text-base shadow-lg hover:bg-blue-600 transition-colors duration-300"
            >
              I'm a Student
            </Link>
            <Link
              href="/"
              className="bg-blue-500 text-white px-4 py-2 rounded text-base shadow-lg hover:bg-blue-600 transition-colors duration-300"
            >
              I'm a Business
            </Link>
          </div>
        </div>
      </div>
      {/* End Of Hero */}

      {/* Filter Jobs */}
      <section>
        {loading ? (
          <div className="w-full flex justify-center py-8">Loading jobs...</div>
        ) : error ? (
          <div className="w-full flex justify-center py-8 text-red-500">
            {error}
          </div>
        ) : (
          <FilterJobs jobs={jobs} />
        )}
      </section>
      {/* End of Filter Jobs */}
    </div>
  );
}
