import { Loader2 } from "lucide-react"

export function AnalyticsLoading() {
  return (
    <div className="w-full space-y-6 animate- ">
      <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 bg-gray-700/70 rounded-md w-2/5"></div>
          <div className="h-6 bg-gray-700/70 rounded-md w-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-gray-600/70"></div>
                <div className="h-4 bg-gray-600/70 rounded w-24"></div>
              </div>
              <div className="h-7 bg-gray-600/70 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-600/70 rounded w-28"></div>
            </div>
          ))}
        </div>

        <div className="h-[300px] w-full bg-gray-700/30 rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <div className="text-gray-400 font-medium">Loading analytics data...</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-6 shadow-lg">
            <div className="h-6 bg-gray-700/70 rounded-md w-1/3 mb-6"></div>
            <div className="h-[250px] w-full bg-gray-700/30 rounded-lg"></div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-6 shadow-lg">
        <div className="h-6 bg-gray-700/70 rounded-md w-1/4 mb-6"></div>
        <div className="h-[250px] w-full bg-gray-700/30 rounded-lg"></div>
      </div>
    </div>
  )
}

