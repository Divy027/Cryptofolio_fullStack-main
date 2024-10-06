const mongoose =require('mongoose');
require('mongoose-type-email');

const ProfileSchema=new mongoose.Schema({
    userId:{
        type:String,
        
    },
    url:{
        type:String,
        
    }
});

module.exports=mongoose.model('Profile',ProfileSchema)