export default function Loader() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="absolute">Loading</div>
      <div className="relative inline-block w-30 h-30 border-[0.072em] border-primarycolor border-t-transparent border-l-transparent rounded-full animate-spin hover:border-[0.172em] transition-all duration-300 ease-in-out"></div>
    </div>
  );
}
