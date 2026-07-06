export default function ChatMessage({message}) {
  return (
    <div className={`
      max-w-[70%]
      rounded-2xl
      bg-blue-600
      px-4
      py-3
      ${message?.sender !== 'AI' ? 'ml-auto text-white' : 'text-zinc-100 mr-auto'}
      `}
    >
      {message?.text || ''}
    </div>
  );
}