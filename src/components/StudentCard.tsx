import Link from "next/link";

interface Student {
  studentId: string;
  name: string;
  level?: string;
  bio?: string;
  skills?: string[];
}

export default function StudentCard({ student }: { student: Student }) {
  return (
    <div className="w-[360px] h-[300px] bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4">
      <div className="w-full p-2 flex flex-col space-y-2">
        <h2 className="text-xl font-bold min-h-[2.8em] line-clamp-2">
          {student.name || ""}
        </h2>
        <p className="text-gray-600 min-h-[2em] line-clamp-1">
          {student.level || ""}
        </p>
        <div className="overflow-x-scroll">
          <div className="flex space-x-2 p-2">
            {student.skills?.map((skill) => (
              <span
                key={skill}
                className="bg-blue-300 text-white px-3 py-1 rounded-sm text-sm whitespace-nowrap"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-600 min-h-[3em] line-clamp-2">
          {student.bio || ""}
        </p>
      </div>
      <div className="flex-1 flex items-end">
        <Link
          href={`/studentprofile/${student.studentId}`}
          className="bg-blue-500 text-white px-2 py-1 rounded text-base shadow-lg hover:bg-blue-600 transition-colors duration-300 mt-auto"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
