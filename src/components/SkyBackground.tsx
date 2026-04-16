const SkyBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Sky gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,60%,88%)] via-[hsl(215,40%,93%)] to-[hsl(30,30%,94%)]" />

    {/* Clouds */}
    <div className="cloud-1 absolute top-[8%] left-[-5%] w-[55%] h-[18%] rounded-full bg-white/40 blur-2xl" />
    <div className="cloud-2 absolute top-[15%] right-[-8%] w-[45%] h-[14%] rounded-full bg-white/30 blur-3xl" />
    <div className="cloud-3 absolute top-[35%] left-[10%] w-[35%] h-[10%] rounded-full bg-white/25 blur-2xl" />
    <div className="cloud-4 absolute top-[55%] right-[5%] w-[40%] h-[12%] rounded-full bg-white/20 blur-3xl" />
    <div className="cloud-1 absolute top-[75%] left-[-10%] w-[50%] h-[15%] rounded-full bg-white/15 blur-3xl" />

    {/* Warm bottom glow */}
    <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[hsl(30,40%,92%)]/60 to-transparent" />
  </div>
);

export default SkyBackground;
