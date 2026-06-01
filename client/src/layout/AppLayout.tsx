import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "../context/SidebarContext";
import { HeaderProvider } from "../context/HeaderContext";

const LayoutContent = () => {
  return (
    <>
      <div>
        <AppSidebar />
      </div>
      <div>
        <AppHeader />
      </div>
      <div className="pt-20 pl-0 sm:pl-72 bg-[#0E1A3A] h-screen overflow-hidden transition-all duration-300">
        <div className="p-6 md:p-8 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </div>
      </div>
    </>
  );
};

const AppLayout = () => {
  return (
    <>
      <HeaderProvider>
        <SidebarProvider>
          <LayoutContent />
        </SidebarProvider>
      </HeaderProvider>
    </>
  );
};

export default AppLayout;
