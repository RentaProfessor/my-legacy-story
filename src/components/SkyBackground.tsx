const SkyBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Light blue sky gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(205,65%,85%)] via-[hsl(210,50%,90%)] to-[hsl(215,35%,93%)]" />

    {/* Clouds - more visible, light blue tinted */}
    <div className="cloud-1 absolute top-[6%] left-[-5%] w-[60%] h-[20%] rounded-full bg-white/55 blur-2xl" />
    <div className="cloud-2 absolute top-[14%] right-[-8%] w-[50%] h-[16%] rounded-full bg-white/45 blur-3xl" />
    <div className="cloud-3 absolute top-[32%] left-[8%] w-[40%] h-[12%] rounded-full bg-white/40 blur-2xl" />
    <div className="cloud-4 absolute top-[50%] right-[3%] w-[45%] h-[14%] rounded-full bg-white/35 blur-3xl" />
    <div className="cloud-1 absolute top-[70%] left-[-8%] w-[55%] h-[16%] rounded-full bg-white/30 blur-3xl" />
    <div className="cloud-2 absolute top-[85%] right-[-5%] w-[40%] h-[12%] rounded-full bg-white/25 blur-2xl" />

    {/* Soft bottom wash */}
    <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[hsl(210,30%,94%)]/40 to-transparent" />
  </div>
);

export default SkyBackground;
