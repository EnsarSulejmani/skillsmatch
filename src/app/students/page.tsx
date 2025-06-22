"use client";

import StudentCard from "@/components/StudentCard";
import React, { useEffect, useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  level: string;
  bio: string;
  skills: string[];
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Simulate API call, replace with real fetch later
    setStudents([
      {
        id: "1",
        firstName: "Jane",
        lastName: "Doe",
        level: "Graduate",
        bio: "Passionate about web development and design.",
        skills: ["React", "TypeScript", "CSS"],
      },
      {
        id: "2",
        firstName: "John",
        lastName: "Smith",
        level: "Undergraduate",
        bio: "Aspiring data scientist and AI enthusiast.",
        skills: ["Python", "Machine Learning", "Data Analysis"],
      },
    ]);
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-[1240px] flex flex-wrap gap-6 justify-center py-8">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
