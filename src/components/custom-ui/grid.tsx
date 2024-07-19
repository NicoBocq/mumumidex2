export default function Grid({ children }: { children: React.ReactNode }) {
  return <div className="-mt-6 grid grid-cols-1 gap-4">{children}</div>
}
