const SkyBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Light blue sky gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(205,70%,82%)] via-[hsl(210,55%,87%)] to-[hsl(215,40%,91%)]" />

    {/* Clouds - sharper, light blue tinted */}
    <div className="cloud-1 absolute top-[4%] left-[-5%] w-[60%] h-[18%] rounded-full bg-[hsl(210,60%,95%)]/75 blur-xl" />
    <div className="cloud-2 absolute top-[10%] right-[-6%] w-[50%] h-[15%] rounded-full bg-[hsl(208,55%,94%)]/65 blur-xl" />
    <div className="cloud-3 absolute top-[28%] left-[8%] w-[40%] h-[12%] rounded-full bg-[hsl(210,50%,96%)]/55 blur-lg" />
    <div className="cloud-4 absolute top-[46%] right-[2%] w-[45%] h-[13%] rounded-full bg-[hsl(207,55%,95%)]/50 blur-xl" />
    <div className="cloud-1 absolute top-[64%] left-[-6%] w-[55%] h-[15%] rounded-full bg-[hsl(210,50%,96%)]/45 blur-xl" />
    <div className="cloud-2 absolute top-[80%] right-[-4%] w-[42%] h-[12%] rounded-full bg-[hsl(208,45%,95%)]/40 blur-lg" />

    {/* Soft bottom wash */}
    <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-[hsl(210,35%,92%)]/50 to-transparent" />
  </div>
);

export default SkyBackground;
