import Link from "next/link";

interface Student {
  studentId: string;
  name: string;
  email?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  profileImageUrl?: string;
  reviews?: number;
  industry?: string;
}

export default function StudentCard({ student }: { student: Student }) {
  return (
    <div className="w-[340px] h-[370px] bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-5 flex flex-col gap-4 border border-blue-100 hover:scale-105 hover:shadow-2xl transition-transform duration-200">
      <div className="flex flex-col items-center gap-2">
        {student.profileImageUrl && (
          <img
            src={student.profileImageUrl}
            alt={student.name}
            className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover shadow"
          />
        )}
        <h2 className="text-xl font-extrabold text-blue-900 text-center min-h-[2.8em] line-clamp-2">
          {student.name || ""}
        </h2>
        <p className="text-blue-700 text-sm text-center min-h-[1.5em] line-clamp-1 font-semibold">
          {student.industry || student.location || ""}
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          {student.skills?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-700 text-sm min-h-[3em] line-clamp-2 text-center mt-2">
        {student.bio || ""}
      </p>
      <div className="flex-1 flex items-end justify-center mt-2">
        <Link
          href={`/studentprofile/${student.studentId}`}
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
