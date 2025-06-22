import Link from "next/link";

interface Business {
  businessId: string;
  name: string;
  industry: string;
  location: string;
  bio: string;
}

export default function BusinessCard({ business }: { business: Business }) {
  return (
    <div className="w-[360px] h-[300px] bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4">
      <div className="w-full p-2 flex flex-col space-y-2">
        <h2 className="text-xl font-bold min-h-[2.8em] line-clamp-2">
          {business.name}
        </h2>
        <p className="text-gray-600 min-h-[2em] line-clamp-1">
          {business.industry} - {business.location}
        </p>
        <p className="text-gray-600 min-h-[5.6em] line-clamp-4">
          {business.bio}
        </p>
      </div>
      <div className="flex-1 flex items-end">
        <Link
          href={`/businessprofile/${business.businessId}`}
          className="bg-blue-500 text-white px-4 py-2 rounded text-base shadow-lg hover:bg-blue-600 transition-colors duration-300 mt-auto"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
