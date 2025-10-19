import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const {loading,error}=useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const handleChange = (e) => {
    setData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      // setLoading(true);
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message))
        return;
      }
      // setLoading(false);
      // setError(null)
      dispatch(signInSuccess(data))
      navigate("/");
    } catch (err) {
      // setLoading(false);
      // setError(err.message);
      dispatch(signInFailure(err.message))
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7">Sign in</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
           className="border rounded-lg p-3"

        />
        <button type="submit" className="bg-slate-700 rounded p-4">
          {loading? 'Loading...':'Sign in'}
        </button>
        <OAuth/>
        {error && <p className="text-red-500 text-center">{error}</p>}

      </form>
      <div className="flex gap-2 mt-5">
              <p>Dont have an account?</p>
              <Link to={"/sign-up"}>
                <span className="text-blue-700">Sign Up</span>
              </Link>
            </div>
    </div>
  );
};

export default SignIn;
