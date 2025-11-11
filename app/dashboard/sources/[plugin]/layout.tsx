export default function Layout({ children }: LayoutProps<"/dashboard/sources">) {
  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <p className="text-sm text-gray-600 italic mb-6 text-center">
        ⚠️ We strongly recommend that the access tokens or keys entered here are{" "}
        <span className="font-semibold">read-only</span>.
      </p>
      {children}
    </div>
  );
}
