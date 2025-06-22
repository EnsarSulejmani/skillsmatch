"use client";
import FilterJobs from "@/components/Filters/FilterJobs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [offset, setOffset] = useState(0);

  // Placeholder jobs
  const jobs = [
    {
      jobId: "job1",
      createdBy: "businessA",
      title: "Frontend Developer Needed for Portfolio Site",
      description:
        "Seeking a student to build a modern, responsive portfolio website using React and Tailwind CSS. Experience with Figma is a plus.",
      skillsRequired: ["React", "Tailwind CSS", "Figma"],
      budget: 300,
      status: "open" as const,
      applicants: [],
    },
    {
      jobId: "job2",
      createdBy: "businessB",
      title: "Data Analysis for Marketing Campaign",
      description:
        "Analyze marketing data and provide insights. Must be proficient in Python and data visualization tools. Report writing required.",
      skillsRequired: [
        "Python",
        "Pandas",
        "Data Visualization",
        "Report Writing",
      ],
      budget: 400,
      status: "open" as const,
      applicants: [],
    },
    {
      jobId: "job3",
      createdBy: "businessC",
      title: "Social Media Content Creator",
      description:
        "Create engaging content for our social media platforms. Skills in Canva and copywriting are essential.",
      skillsRequired: ["Canva", "Copywriting", "Social Media"],
      budget: 250,
      status: "open" as const,
      applicants: [],
    },
    {
      jobId: "job4",
      createdBy: "businessA",
      title: "Frontend Developer Needed for Portfolio Site",
      description:
        "Seeking a student to build a modern, responsive portfolio website using React and Tailwind CSS. Experience with Figma is a plus.",
      skillsRequired: ["React", "Tailwind CSS", "Figma"],
      budget: 300,
      status: "open" as const,
      applicants: [],
    },
    {
      jobId: "job5",
      createdBy: "businessB",
      title: "Data Analysis for Marketing Campaign",
      description:
        "Analyze marketing data and provide insights. Must be proficient in Python and data visualization tools. Report writing required.",
      skillsRequired: [
        "Python",
        "Pandas",
        "Data Visualization",
        "Report Writing",
      ],
      budget: 400,
      status: "open" as const,
      applicants: [],
    },
    {
      jobId: "job6",
      createdBy: "businessC",
      title: "Social Media Content Creator",
      description:
        "Create engaging content for our social media platforms. Skills in Canva and copywriting are essential.",
      skillsRequired: ["Canva", "Copywriting", "Social Media"],
      budget: 250,
      status: "open" as const,
      applicants: [],
    },
  ];

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
        <FilterJobs jobs={jobs} />
      </section>
      {/* End of Filter Jobs */}
    </div>
  );
}
