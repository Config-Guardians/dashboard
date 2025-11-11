export default function LayoutPage({ children }: LayoutProps<"/dashboard/misconfigurations">) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Misconfigurations</h1>
      </div>
      {children}
    </div>
  );
}
