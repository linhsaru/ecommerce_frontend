import { useForm } from 'react-hook-form';
import TextField from '../../components/form/TextField';
import loginFormRules from '../../forms/formRules/loginFormRules';
import { useNavigate } from 'react-router-dom';
import { API } from '../../api/axiosConfig';

const Login = () => {
  const navigation = useNavigate();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const dataReponsiveSignin = {
        accessToken:
          'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzeXNhZG1pbiIsImV4cCI6MTcyMTcyNTcxMCwiaWF0IjoxNzIxNjM5MzEwfQ.2yIoLUaTfzA4zWbr25OQZPKH9jgfKifWCWdxBZvIVETw2R8R45BabLo58DlKKnOA3_hv-G_eiXb9KC6JmKtEkw',
        fullName: 'Sys ADMIN',
        email: '',
        teamName: 'Root',
        roleName: 'ADMIN',
        userName: 'sysadmin',
      };
      const dataSubmit = await API.post('auth/signIn', {
        username: 'sysadmin',
        password: 'Admin@123',
      });
      localStorage.setItem('userSession', JSON.stringify(dataReponsiveSignin));
      navigation('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          name="username"
          label="Username"
          placeholder="Username"
          control={control}
          rules={loginFormRules.username}
        />

        <TextField
          name="password"
          label="Password"
          type="password"
          placeholder="********"
          control={control}
          rules={loginFormRules.password}
        />

        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
