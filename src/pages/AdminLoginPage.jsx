import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLoginPage = () => {
  const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  }).required();

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false); // State to manage Snackbar visibility

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://reacttask.mkdlabs.com/v2/api/lambda/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project': 'cmVhY3R0YXNrOmQ5aGVkeWN5djZwN3p3OHhpMzR0OWJtdHNqc2lneTV0Nw=='
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: 'admin'
        })
      });

      const responseData = await response.json();

      console.log('Login response:', responseData);

      if (responseData.error === false) {
        const { token } = responseData;

        console.log('Login successful. Token:', token);

        dispatch({ type: 'LOGIN', payload: { token } });

        setShowSnackbar(true);

        navigate('/pages/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("email", { message: "Invalid credentials" });
      setError("password", { message: "Invalid credentials" });
    }
  };
  useEffect(() => {
    if (showSnackbar) {
      toast.success('Login successful!', {
        autoClose: 3000 // Adjust the autoClose duration as needed
      });
      setShowSnackbar(false);
    }
  }, [showSnackbar]);
    return (
    <div className="w-full max-w-xs mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8 "
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="******************"
            {...register("password")}
            className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-red-500 text-xs italic">
            {errors.password?.message}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            value="Sign In"
          />
        </div>
      </form>
    </div>
  );
};

export default AdminLoginPage;
