import { Outlet } from "react-router-dom"

const AppLayout = () => {
 return (
    <div className="min-h-screen bg-background text-foreground">
    {/* You can add Sidebar / Topbar here */}
    <Outlet />
  </div>
 )
}

export default AppLayout