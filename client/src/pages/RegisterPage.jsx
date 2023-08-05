import axios from "axios";
import { useState } from "react";
import {Link} from "react-router-dom";
// const url ='http://localhost:4000';
export default function RegisterPage(){
    const[name,setName] = useState('');
    const[email,setEmail] = useState('');
    const [password,setPassword] = useState('');
async function register(ev){
    ev.preventDefault();
   try{
    const registered = await axios.post('/register',{
        name,
        email,
        password,
     });
     alert("Registration Successful, Now you can login")

   }catch(err){
    alert("Registration failed!! Please try again!")
   }
}

return (
   
    <div className="mt-4 grow flex items-center justify-around">
   <div className="mb-64">
   <h1 className="text-4xl text-center mb-4">Register</h1>
        
        <form action="" onSubmit={register} className="max-w-md mx-auto">
            <input type="text" placeholder="Name" value={name} onChange={ev=>setName(ev.target.value)}/>
            <input type="email" value={email} onChange={ev=>setEmail(ev.target.value)} placeholder="your@email.com" />
            <input type="password" placeholder="password" value={password} onChange={ev=>setPassword(ev.target.value)}/>
            <button className="primary">Register</button>
            <div className="text-center py-2 text-gray-500">
             Already a member?<Link className="underline text-black" to={'/login'}>Login</Link>
            </div>
        </form>
   </div> 
      
    </div>
)
}