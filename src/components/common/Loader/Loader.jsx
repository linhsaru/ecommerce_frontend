import '../../../assets/styles/loader.css';
const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="loader-container">
        <div className="loader h-16 w-16 rounded-full border-t-4 border-blue-500"></div>
      </div>
    </div>
  );
};

export default Loader;
