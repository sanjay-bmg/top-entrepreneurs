interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
}

export default function BrowserFrame({
  url = "topentrepreneurs.com",
  children,
}: BrowserFrameProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
      {/* Chrome bar */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-500">
          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-gray-600 font-medium">{url}</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white overflow-hidden">{children}</div>
    </div>
  );
}
