import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false); // after sign in to add bio and go to bio page

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(currState === "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currState === "Sign up" ? "signup" : "login", {fullName, email, password, bio});
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
        
        {/* LEFT */}

        <img src={assets.logo1} alt="log" className='w-[min(30vw, 250px)] w-40' />

        {/* RIGHT */}

        <form 
          onSubmit={onSubmitHandler}
          className='border-2 bg-black/30 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg cursor-pointer'>
            <h2 className='font-medium text-2xl flex justify-between items-center'>
              {currState}
              {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="icon" className='w-5 cursor-pointer' />}
              
            </h2>

            {currState === 'Sign up' && !isDataSubmitted && ( // when state is sign up and data not submitted show FULL NAME
                <input type="text" 
                  onChange={(e) => setFullName(e.target.value)} value={fullName} 
                  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400'
                  placeholder='Full Name' required
                />
            )}

            {!isDataSubmitted && (
              <>
                <input
                  onChange={(e) => setEmail(e.target.value)} value={email} 
                  type="email" placeholder='Email Address' required 
                  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400'
                />

                <input
                  onChange={(e) => setPassword(e.target.value)} value={password} 
                  type="password" placeholder='Password' required 
                  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400'
                />
              </>
            )}

            {/* BIO SECTION -> ONLY SIGNUP AND ISDATASUBMITTED == TRUE */}

            {
                currState === "Sign up" && isDataSubmitted && (
                  <textarea 
                    onChange={(e) => setBio(e.target.value)} value={bio}
                    rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    placeholder='Provide a short Bio...' required></textarea>
                )
            }

            <button 
              type='submit'
              className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
              
              {currState === 'Sign up' ? "Create Account" : "Login Now"}
            </button>

            <div>
              <input type="checkbox"  />
              <p>Agree to the terms of use & privacy policy.</p>
            </div>

            <div className='flex flex-col gap-2'>
              {currState === "Sign up" ? 
              (
                <p className='text-sm text-gray-400'>Already have an account? 
                  <span 
                      onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}}
                      className='font-medium text-violet-500 cursor-pointer'>Login here
                  </span>
                </p>
              ) : (
                <p className='text-sm text-gray-400'>Create an account? 
                  <span 
                       onClick={()=>{setCurrState("Sign up"); setIsDataSubmitted(false)}}
                      className='font-medium text-violet-500 cursor-pointer'>Click here
                  </span>
                </p>
              )}
            </div>
            
        </form>
    </div>
  )
}

export default LoginPage