import { useEffect, useState } from "react";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks"
import AccountNav from "./AccountNav";
// import { useParams } from "react-router-dom";
import { Navigate, useParams } from "react-router-dom";


export default function(){
    const {id} = useParams();
    console.log({id});
    const[title,setTitle] = useState('');
    const[price,setPrice] = useState('');
    const[address,setAddress] = useState('');
    const[addedPhotos,setAddedPhotos]= useState([]);
    const[description,setDescription] = useState('');
  
    const[perks,setPerks] = useState([]);
    const[extraInfo,setExtraInfo] = useState('');
    const[checkIn ,setCheckin] = useState('');
    const[checkOut,setCheckout] = useState('');
    const[maxGuests,setMaxGuests] = useState(1);
    const [redirect ,setRedirect] = useState(false);
    useEffect(()=>{
    if(!id){
        return
    }
    axios.get('/places/'+id).then(response=>{
        const {data} = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description); 
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckin(data.checkIn);
        setCheckout(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);


    });
    
    },[id]);

    async function savePlace(ev){
        ev.preventDefault();
        if(id){

            const placedata = {title, id,
                address,addedPhotos,description,perks
                ,extraInfo,checkIn,checkOut,maxGuests,price
            };
        
          await axios.put('places',placedata);

     

        }
        else{
            const placedata = {title,
                address
                ,addedPhotos,description,perks
                ,extraInfo,checkIn,checkOut,maxGuests,price
            };
        
          await axios.post('places',placedata);
          setRedirect(true);
        }
      
      
     
    
      }
    
      if(redirect){
        return <Navigate to={'/account/places'} replace={true}/>
      }
    
    return (

        <div>
            <AccountNav/>
        <form action="" onSubmit={savePlace}>
            <h2 className="text-2xl mt-4">Title</h2>
            <p className="text-gray-500 text-small" >Title for your place</p>
            <input type="text" value={title} onChange={ev=>setTitle(ev.target.value)} placeholder="title, for example My lovely appartment" />
            <h2 className="text-2xl mt-4">Address</h2>
            <input type="text" placeholder="address" value={address} onChange={ev=>setAddress(ev.target.value)} name="" id="" />
            <h2 className="text-xl mt-4" >Photos</h2>
            <p className=" text-gray-500 text-sm"> more = better</p>

            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>

            <div>
                <h2 className="text-2xl mt-4">Description</h2>
                <p className="text-gray-500 text-sm">description of the place</p>
                  <textarea  color="black" value={description} onChange={ev=>setDescription(ev.target.value)} type="text" className="w-full border p-2 text-black rounded-2xl" ></textarea>
            </div>

            <h2 className="text-2xl mt-4">Perks</h2>
                <p className="text-gray-500 text-sm">Select all the perks</p>
             <div className=" grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks}/>
             </div>

             <h2 className="text-2xl mt-4">Extra Info</h2>
                <p className="text-gray-500 text-sm">House rules ,ets</p>
              <textarea  type="text" value={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)} className="w-full border p-2  text-white rounded-2xl"></textarea>

              <h2 className="text-2xl mt-4">Check in & out time and max guests</h2>
                <p className="text-gray-500 text-sm"> add info</p>

                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                    <input value={checkIn} onChange={ev=>setCheckin(ev.target.value)} type="text" placeholder="14:00" />

                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                    <input value={checkOut} placeholder="14:00" onChange={ev=>setCheckout(ev.target.value)} type="text" name="" id="" />

                    </div>
                    <div>
                  <h3 className="mt-2 -mb-1">Max number of guests</h3>
                    <input value={maxGuests} onChange={ev=>setMaxGuests(ev.target.value)}  type="number" name="" id="" />

                    </div>
                    <div>
                  <h3 className="mt-2 -mb-1">Price per night</h3>
                    <input value={price} onChange={ev=>setPrice(ev.target.value)}  type="number" name="" id="" />

                    </div>


                    <div>
                        <button className="primary my-4">Save</button>
                    </div>
                </div>
        </form>
    </div>

    )
}