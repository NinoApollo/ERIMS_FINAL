import { useEffect } from "react";

const DashboardMainPage = () => {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-slate-900 p-6 shadow-lg">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Overview
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl">
            Monitor request activity, inventory records, and account management
            from one clean workspace.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-slate-800 p-5">
            <p className="text-sm font-medium text-slate-300">Accounts</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              Students and personnel
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Maintain user details, roles, departments, and profile records.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800 p-5">
            <p className="text-sm font-medium text-slate-300">Inventory</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              Equipment and areas
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Keep equipment quantities, locations, categories, and status in
              sync.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800 p-5">
            <p className="text-sm font-medium text-slate-300">Requests</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              Forms and monitoring
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Review equipment requests and audit important account activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMainPage;
