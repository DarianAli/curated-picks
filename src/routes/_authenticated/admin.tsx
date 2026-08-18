import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { FolderTree, LayoutDashboard, LogOut, Package } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — The Shortlist" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/categories", label: "Categories", icon: FolderTree, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
          <Link to="/" className="font-display text-lg">
            The Shortlist<span className="text-accent">.</span>
            <span className="ml-2 text-xs uppercase tracking-widest text-muted-foreground">
              Admin
            </span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row">
        <nav aria-label="Admin" className="md:w-52 md:shrink-0">
          <ul className="flex gap-2 md:flex-col">
            {NAV.map(({ to, label, icon: Icon, exact }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact }}
                  activeProps={{ className: "bg-secondary text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
