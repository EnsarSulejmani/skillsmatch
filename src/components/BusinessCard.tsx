import Link from "next/link";

interface Business {
  businessId: string;
  name: string;
  industry: string;
  location: string;
  bio: string;
  profileImageUrl?: string;
  skills?: string[];
  verified?: boolean;
}

export default function BusinessCard({ business }: { business: Business }) {
  return (
    <div className="w-[340px] h-[370px] bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-5 flex flex-col gap-4 border border-blue-100 hover:scale-105 hover:shadow-2xl transition-transform duration-200">
      <div className="flex flex-col items-center gap-2">
        {business.profileImageUrl && (
          <img
            src={business.profileImageUrl}
            alt={business.name}
            className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover shadow"
          />
        )}
        <h2 className="text-xl font-extrabold text-blue-900 text-center min-h-[2.8em] line-clamp-2">
          {business.name}
        </h2>
        <p className="text-blue-700 text-sm text-center min-h-[1.5em] line-clamp-1 font-semibold">
          {business.industry} - {business.location}
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          {business.skills?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
          {business.verified && (
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
              Verified
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-700 text-sm min-h-[3em] line-clamp-2 text-center mt-2">
        {business.bio}
      </p>
      <div className="flex-1 flex items-end justify-center mt-2">
        <Link
          href={`/businessprofile/${business.businessId}`}
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
