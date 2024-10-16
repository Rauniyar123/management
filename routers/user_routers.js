/*...............import dependancies..............*/
const express =require("express");
const router=express();
const multer=require('multer');


//import auth middleware
const auth=require("../middleware/userTokenHandler");


// use multer
const storage=multer.diskStorage({
	destination:"uploads",
	filename:(req,file,cb)=>{
		cb(null,file.originalname);
	},

});


  const upload=multer({
	storage:storage,
	fileFilter:function(req,file,callback){
		if(file.mimetype == "image/png" ||
                 file.mimetype == "image/jpg" ||
                 file.mimetype == "image/jpeg"||
                 file.mimetype == "text/csv"  ||
				 file.mimetype == "application/pdf" ||
				 file.mimetype == "audio/mpeg" || 
				 file.mimetype == "video/mp4" 
			){
			callback(null,true)
		}else{
			console.log('only  png , jpg & jpeg,csv file supported')
                     callback(null,false)
		}
	},
	limits:{
		 filesize:100000000000 //1000000 bytes=1MB
   }


});
  
 

/*............import user_controllers.........*/
const userControllers=require("../controllers/user_controller");




/*..........set user controllers url...........*/
router.post("/addUser",upload.single('userProfile'),userControllers.addUser);
router.get("/allUserList",userControllers.allUserList);
router.post("/updateUserProfile",upload.single('userProfile'),userControllers.updateUserProfile);
router.post("/getUserProfile",userControllers.getUserProfile);


/*..............export router..................*/
module.exports=router;