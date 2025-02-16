/*............import dependancies.........*/
const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
	uniqueId:{
		type:Number,
	},
	
	userName:{
		type:String,
	},
	email:{
		type:String,
	},
	fcmId:{
		type:String,
	},
	password:{
		type:String
	},
	
	userProfile:{
		type:String
	},
	
	userStatus:{
		type:Number,
	    default:0,
	},
	
	activeStatus:{
		type:Number,
	    default:0,
	},
	
	gender:{
		type:String,
		
	},
	phone:{
		type:String,
		
	},
	dob:{
		type:String,
		
	},
	

},{timestamps:true});


/*.............exports userSchema from here............*/
module.exports =userModel=mongoose.model("user",userSchema);