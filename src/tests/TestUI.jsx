import { Outlet } from 'react-router-dom';

const TestUI = () => {
  return (
    <div>
      <h1 className="text-center text-5xl">Test Component UI</h1>
      <Outlet />
    </div>
  );
};

export default TestUI;
