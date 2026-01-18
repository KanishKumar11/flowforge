import { SidebarTrigger } from "./ui/sidebar";
export const AppHeader = () => {
  return (
    <header className="flex items-center px-4 gap-2 shrink-0 h-14 border-b bg-background">
      <SidebarTrigger />
    </header>
  )
}