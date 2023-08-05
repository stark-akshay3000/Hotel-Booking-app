import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";

export default function ProfilePage(){
    const[redirect,setRedirect] = useState(null);

const {ready,user,setUser}  = useContext(UserContext); 

let {subpage} = useParams();
if(subpage ===undefined){
    subpage='profile';
}
 
async function logout(){
  await  axios.post('/logout');
  setRedirect('/');
  setUser(null);



}

if(!ready){
    return 'Loading......';
}

if( ready && !user &&!redirect) {
    return <Navigate to={'/login'} replace={true}/>
}



// console.log(subpage);




if(redirect){
    return <Navigate to={redirect} replace={true}  />
}



    return (

       <div> 
       
        <AccountNav/>    
        
        {subpage==='profile'&&(
        <div className="text-center max-w-lg max-auto">
        Logged in as  {user.name} {user.email}

        <button onClick={logout} className="primary max-w-small">LogOut</button>

        </div>
        )}
        
        {subpage==='places' && (
            <PlacesPage/>
        )}
       </div>
    )
}