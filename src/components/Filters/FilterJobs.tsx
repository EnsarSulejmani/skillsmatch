import JobCard from "@/components/JobCard";

interface Job {
  jobId: string; // unique identifier for the job
  createdBy: string; // business ID that created the job
  title: string;
  description: string;
  skillsRequired: string[];
  budget: number; // budget for the job
  status: "open" | "in-progress" | "completed" | "cancelled"; // current status of the job
  applicants: string[]; // list of student IDs who applied for the job
}

interface FilterJobsProps {
  jobs: Job[];
}

export default function FilterJobs({ jobs }: FilterJobsProps) {
  return (
    <div className="w-full flex items-center justify-center py-8 border-black">
      <div className="w-[1240px]">
        <section className="h-[500px] w-full flex items-center justify-center gap-6 flex-wrap">
          {jobs.map((job) => (
            <JobCard key={job.jobId} job={job} />
          ))}
        </section>
      </div>
    </div>
  );
}
