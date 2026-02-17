export default function AdBanner() {
  const PUBLISHER_ID = "pub-2793977718393893";
  const BANNER_ID = "ca-app-pub-2793977718393893/8493021948"; // Placeholder format for banner

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 py-2 px-4 flex items-center justify-center">
        <div className="bg-gray-700/50 border-2 border-dashed border-gray-500 rounded-lg w-full max-w-lg h-14 flex flex-col items-center justify-center">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">AdMob Banner</span>
          <span className="text-gray-600 text-[10px] font-mono">{BANNER_ID}</span>
        </div>
      </div>
    </div>
  );
}
