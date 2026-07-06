
// "use client"
export default function Button({label = "Test",onUserClick}) {
  return (
    <button onClick={()=>onUserClick()} className="w-full
        rounded-lg
        bg-blue-600
        px-4
        py-2.5
        text-sm
        font-medium
        text-white
        transition
        duration-150
        hover:bg-blue-500
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50">
        {label}
    </button>
  );
}
