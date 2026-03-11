/**
 * Content shown on the phone screen. Replace or swap this component
 * to change what appears on the device (e.g. different pages, apps).
 */
export default function PhoneScreen() {
  return (
    <div
      className="w-[736px] h-[1594px] flex flex-col items-center justify-center bg-white text-black p-[100px] box-border font-sans overflow-hidden rounded-[60px] [clip-path:inset(0_round_60px)]"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <h2 className="mb-1.5 text-[30px]">Hello</h2>
      <p className="m-0 text-[40px] opacity-80">Welcome to MemoryAI</p>
    </div>
  );
}
