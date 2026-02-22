import { useForm } from 'react-hook-form';
import TextField from '../../components/form/TextField';
import { apiGetDemo } from '../../api/demo';
import loginFormRules from '../../forms/formRules/loginFormRules';
import SelectField from '../../components/form/SelectField';
import CheckboxField from '../../components/form/CheckboxField';

const FormSubmit = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const rqBody = {
        type: 0,
      };
      const data = await apiGetDemo(rqBody);
      console.log(data);
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
          control={control}
          rules={loginFormRules.password}
        />

        <div className="">
          <SelectField
            name="gender"
            label="Gender"
            control={control}
            defaultValue={{ label: 'NDP', value: 'ndp', disabled: true }}
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
          />
        </div>

        <CheckboxField disabled name="agree" label="Yes" control={control} />
        <CheckboxField name="agree1" label="No" control={control} />

        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormSubmit;
