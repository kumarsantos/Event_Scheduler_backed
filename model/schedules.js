const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types//making relation to user model

const ScheduleSchema=new mongoose.Schema({
    EventName:{
        type:String,
        required:true
    },
    EventDisc:{
        type:String,
        required:true
    },
    StartTime:{
        type:String,
        required:true
    },
    EndTime:{
        type:String,
        required:true
    },
    DayOfWeek:{
        type:String,
        required:true
},
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
})

mongoose.model('Schedule',ScheduleSchema)