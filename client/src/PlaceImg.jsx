export default function PlaceImg({place}){


 if(!place.photos?.length){
return '';

 }
 
 if(!className){
    className='object-cover';
 }

    return (
        <>
      
        
            
     <img className={className} src={'http://localhost:4000/'+place.photo[0]} alt="" />  
         
    
        </>
    )
}