import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col justify-between">
      <main className="flex-1 flex flex-col bg-secondary">
        <Outlet />
      </main>
    </div>
  );
}
