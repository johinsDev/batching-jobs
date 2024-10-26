const ServerInfoSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="bg-muted mb-6 flex h-32 items-center justify-center rounded-lg text-center">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-white" />
      </div>

      {/* Destroy server button skeleton */}
      <div className="mb-6 h-10 w-32 animate-pulse rounded-lg bg-red-100" />

      <ul>
        {/* Timeline items */}
        {new Array(3).fill(null).map((_, index) => (
          <li className="group relative pb-10" key={index}>
            <div className="bg-muted absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 transition-colors group-last:hidden" />
            <div className="group relative flex items-start">
              <span className="flex h-9 items-center">
                <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-purple-100" />
              </span>
              <div className="ml-4 space-y-1">
                <div className="h-5 w-64 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServerInfoSkeleton
