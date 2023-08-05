import { useContext, useState } from "react";
import {Link, Navigate} from "react-router-dom";
import  axios  from "axios";
import { UserContext } from "../UserContext";

export default function loginPage(){
    const[email,setEmail] =useState('');
    const [password,setPassword] = useState('');
    const [redirect ,setRedirect] = useState(false);
    const {setUser}= useContext(UserContext);


    async function handlelogin(ev){
        ev.preventDefault();
        
   try{
    
  const {data} =  await axios.post('/login',{
        email,
        password
    },
   

    // {withCredentials:true}
    );
    setUser(data);

    alert("Login successful");
    setRedirect(true);

   }catch(err){
    console.log(err);
    alert("Login failed!!");
   }

    }
    if(redirect){
        return <Navigate to ={'/'}  replace={true}/>
    }

return (
   
    <div className="mt-4 grow flex items-center justify-around">
   <div className="mb-64">
   <h1 className="text-4xl text-center mb-4">LOGIN</h1>
        
        <form action="" onSubmit={handlelogin} className="max-w-md mx-auto">
            <input type="email" value={email} onChange={ev=>setEmail(ev.target.value)} placeholder="your@email.com" />
            <input type="password" value={password} onChange={ev=>setPassword(ev.target.value)} placeholder="password" />
            <button className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">
             Dont't have an account yet?<Link className="underline text-black" to={'/register'}>Register now</Link>
            </div>
        </form>
   </div> 
      
    </div>
)
}