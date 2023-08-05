const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const Users = require('./models/User.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');  
const imageDownloader = require('image-downloader')
const app = express();
const fs = require('fs');
const Place = require('./models/Place.js')
const multer = require('multer');
const bookings = require('./models/booking.js');

const cookieParser = require('cookie-parser');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'jeiocnmxzxpadfjaiencaklfjsla';
app.use(express.json());
app.use(cors({
     credentials: true,
    origin: 'http://127.0.0.1:8000',
}
));
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));

 mongoose.connect(process.env.MONGO_URL);
// console.log(process.env.MONGO_URL);
app.get('/test' ,(req,res )=>{
    res.json("okk");
});
// hOO8VxqnDN8vrN6p
function getUserDataFromToken(req){
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token,jwtSecret,{}, async(err,userData)=>{
      if(err) throw err;
      resolve(userData);
    })
  })
  
 }

app.post('/register',async (req,res)=>{
  try{
    const {name,email,password} = req.body;
    const userDoc =  await Users.create({
     name,
     email,
     password:bcrypt.hashSync(password,bcryptSalt),
    });
    res.json({name,email,password});
  }catch(err)
  {
    console.log(err);
  }
   
});

app.post('/login', async (req,res)=>{
  
  try{
    const{email,password} = req.body;
    // res.json({email,password});
    const userDoc = await  Users.findOne({email});
 
   if(userDoc)
   {
    //  res.json(userDoc);
    const passOk =  bcrypt.compareSync(password,userDoc.password)
    if(passOk){
      //  res.json("pass ok") 
      jwt.sign({email:userDoc.email,id:userDoc._id},jwtSecret,{},(err,token)=>{
          if(err) throw err;

          res.cookie('token',token).json(userDoc);
      })

    }
    else{
      res.json("pass not ok");
    }
   }
   else{
    res.json("Not found")
   } 
  }
  catch(e)
  {
    console.log(e);
  }
 



});

app.get('/profile',(req,res)=>
{
  const {token} = req.cookies;

  // if(token){
  //   res.json("token found");
  // }

   if(token){
    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
      if(err) throw err;
      // res.json(userData);
   const {name,_id,email} = await Users.findById(userData.id);

      res.json({name,_id,email});
     })
   }
  // res.json(token); 
}); 

app.post('/logout',(req,res)=>{
  res.cookie('token','').json("out");
});

app.post('/upload-by-link',async(req,res)=>{
  const {link} = req.body;
  const newName= 'photo'+ Date.now()+'.jpg'
 await imageDownloader.image({
    url:link,
    dest:__dirname+'/uploads/'+newName ,
  })
  res.json(newName)
})
const photosMiddleware = multer({dest:'uploads'})
app.post('/upload', photosMiddleware.array('photos',100),(req,res)=>{
  const uploadedFiles=[];
 
  for(let i =0;i<req.files.length;i++){
     const {path,originalname} =   req.files[i];
    const parts =  originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path+ '.' + ext;
    fs.renameSync(path,newPath);
    uploadedFiles.push(newPath.replace('uploads/','.'));
    
     

  }
res.json(uploadedFiles);  

});

app.post('/places',(req,res)=>{

  const {token} = req.cookies;
  const{title,address,addedPhotos,description,
   perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body;
  jwt.verify(token,jwtSecret,{},async(err,userData)=>{
   if(err) throw err;

   const placeDoc = await Place.create({
    owner:userData.id,
    title,address,photos:addedPhotos,description,
   perks,extraInfo,checkIn,checkOut,maxGuests,price

   });
   res.json(placeDoc);
   

  })

 

   res.json(token);
      
 });

 app.get('/user-places',(req,res)=>{
    const {token} = req.cookies;

    jwt.verify(token,jwtSecret,{}, async(err, userData)=>{
      const{id} = userData;
      const placeDoc = await Place.find({owner:id})

      res.json(placeDoc);
     


    });
    
 })
 app.get('/places/:id', async(req,res)=>{
 const {id}  = req.params;
 

 res.json(await Place.findById(id));
 });

 app.put('/places',async(req,res)=>{
   const {token} = req.cookies;
    const {
      id,title,address,addedPhotos,description,
     perks,extraInfo,checkIn,checkOut,maxGuests,price
    } = req.body;


    jwt.verify(token,jwtSecret,{}, async(err, userData)=>{
      if (err ) throw err; 
    const placeDoc = await Place.findById(id);
     
     if(userData.id === placeDoc.owner.toString()){
      placeDoc.set({
        title,address,photos:addedPhotos,description,
       perks,extraInfo,checkIn,checkOut,maxGuests,price
      })
      await placeDoc.save()

       res.json("save");
     }
    });
 });


 app.get('/places',async(req,res)=>{
  res.json(await Place.find())
 });


 app.post('/bookings', async(req,res)=>{
  // const userData = getUserDataFromToken(req);
  const {place,checkIn,checkOut,
    numberOfGuests, 
    name,phone,price,} = req.body
  const {token} = req.cookies;
  // res.json(token);
  jwt.verify(token,jwtSecret,{}, async(err, userData)=>{
    const{id} = userData;

    
    // const placeDoc = await Place.find({owner:id})
     

   const userDoc =  await bookings.create({
      place,checkIn,checkOut,
      numberOfGuests, 
      name,phone,price,user:userData.id

     });
     res.json(userDoc);
    res.json(id);
   


  });
 })

 
//  });


  app.get('/bookings',async(req,res)=>{
   const userData= await getUserDataFromToken(req);
     res.send( await bookings.find({user:userData.id}).populate('place'))


  }) 



app.listen(4000);