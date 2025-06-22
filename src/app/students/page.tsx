"use client";

import StudentCard from "@/components/StudentCard";
import React, { useEffect, useState } from "react";
import { getAllStudents, Student } from "@/api/students";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllStudents()
      .then(setStudents)
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
        {students.map((student) => (
          <StudentCard key={student.studentId} student={student} />
        ))}
      </div>
    </div>
  );
}
