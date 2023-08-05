import { useEffect, useState } from "react"
import {differenceInCalendarDays} from 'date-fns'

import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useContext } from "react";

export default function BookingWidget({place}){
  const[checkIn,setCheckIn] = useState('');
  const[checkOut,setCheckout] = useState('');
  const[name,setName] = useState('');
  const [mobile , setMobile] = useState('');
  const[numberOfGuests,setNumberOfGuests] = useState('');
 const[redirect ,setRedirect] = useState('');
 const {user} = useContext(UserContext);
 useEffect(()=>{
 if(user){
  setName(user.name)
 }
 },[user]);
  let numberOfNights = 0;

  if(checkIn && checkOut){
    numberOfNights = differenceInCalendarDays(new Date(checkOut),new Date(checkIn));

  }

  async function bookThisPlace() {
    
    const response = await axios.post('/bookings',{
        checkIn,checkOut,numberOfGuests,name,phone:mobile,
        place: place._id,
        price: numberOfNights*place.price
     });
     const bookingId = response.data._id
    //  console.log(bookingId);
     setRedirect(`/account/bookings/${bookingId}`)
  }

  if (redirect){
    <Navigate to={redirect} replace={true}/>

  }
    return (

        <div className="bg-white shadow p-4 rounded-2xl">
           <div className="text-2xl  text-center">  
           Price: $ {place.price}/per night
           
           </div>
           <div className="border rounded-2xl">
            <div className="flex">
            <div className="  py-4 px-4 ">
            <label>Check-in:</label>
            <input type="date" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)} />
           </div>
           <div  className=" py-4 px-4 border-l ">
            <label>Check-out:</label>
            <input type="date"  value={checkOut}  onChange={ev=>setCheckout(ev.target.value)}/>
           </div>
            </div>
            <div>
            <div  className=" py-4 px-4 border-t ">
            <label>Number of guest:</label>
            <input type="number" value={numberOfGuests} onChange={ev=>setNumberOfGuests(ev.target.value)} />
           </div>

            </div>
          
           </div>

           {numberOfNights>0 &&(
            <div className="py-3 px-4 border-t">
                <label >Name:</label>
                <input type="text" value={name}  onChange = {ev=>setName(ev.target.value)} placeholder="Stark" />
                
                <label >Phone no.:</label>
                <input type="tel" value={mobile}  onChange = {ev=>setMobile(ev.target.value)} placeholder="Phone number here" />
            </div>
           )}
           

           
            <button onClick={bookThisPlace} className="primary mt-4">Book this place
            {numberOfNights>0 &&(
                
                <span> ${numberOfNights *place.price}</span>
            )}

            </button>
          </div>
    )
}