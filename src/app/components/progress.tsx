export function Progress({ value }: { value: number }) {
    return (
      <div className="relative w-full bg-gray-200 rounded-full h-4">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    );
  }
  