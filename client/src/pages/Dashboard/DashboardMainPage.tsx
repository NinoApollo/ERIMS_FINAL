import { useEffect } from "react";

const DashboardMainPage = () => {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c9a84c]/70">
            Overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Website Summary
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            This dashboard gives a quick summary of the website status and
            points you to user and role management.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#c9a84c]/20 bg-[#6B1E3C]/20 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c9a84c]">
              Users
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              Manage access
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Add, edit, and remove users from the account system.
            </p>
          </div>
          <div className="rounded-xl border border-[#c9a84c]/20 bg-[#6B1E3C]/20 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c9a84c]">
              Roles
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              Control permissions
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Create and manage role types used across the website.
            </p>
          </div>
          <div className="rounded-xl border border-[#c9a84c]/20 bg-[#6B1E3C]/20 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c9a84c]">
              Summary
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              Fast overview
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Navigate the sidebar to reach the correct area for any admin task.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMainPage;
