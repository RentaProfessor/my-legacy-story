const SkyBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Light blue sky gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(205,70%,82%)] via-[hsl(210,55%,87%)] to-[hsl(215,40%,91%)]" />

    {/* Clouds - light blue tinted, clearly visible */}
    <div className="cloud-1 absolute top-[5%] left-[-5%] w-[65%] h-[22%] rounded-full bg-[hsl(210,60%,95%)]/70 blur-2xl" />
    <div className="cloud-2 absolute top-[12%] right-[-8%] w-[55%] h-[18%] rounded-full bg-[hsl(208,55%,94%)]/60 blur-3xl" />
    <div className="cloud-3 absolute top-[30%] left-[5%] w-[45%] h-[14%] rounded-full bg-[hsl(210,50%,96%)]/55 blur-2xl" />
    <div className="cloud-4 absolute top-[48%] right-[0%] w-[50%] h-[16%] rounded-full bg-[hsl(207,55%,95%)]/50 blur-3xl" />
    <div className="cloud-1 absolute top-[65%] left-[-8%] w-[60%] h-[18%] rounded-full bg-[hsl(210,50%,96%)]/45 blur-3xl" />
    <div className="cloud-2 absolute top-[80%] right-[-5%] w-[45%] h-[14%] rounded-full bg-[hsl(208,45%,95%)]/40 blur-2xl" />

    {/* Soft bottom wash */}
    <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[hsl(210,35%,92%)]/50 to-transparent" />
  </div>
);

export default SkyBackground;
