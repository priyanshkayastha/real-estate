import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.message);
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
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
