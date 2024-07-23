import AdminSidebar from "@/components/AdminSidebar"

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (

    <div className="flex  flex-col">
      <div className="flex flex-row">
        <AdminSidebar />
        <div className="pt-2 md:pt-4 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
