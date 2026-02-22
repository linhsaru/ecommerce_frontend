const LoadingOverlay = ({ text }) => {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="rounded-lg bg-gray-800 p-8 text-white shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <div className="loader h-16 w-16 rounded-full border-8 border-t-8 border-white ease-linear"></div>
        </div>
        <p className="text-center">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
