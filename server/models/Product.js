import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    slug:{
        type:String,
        required:true,
        unique:true
    },

    description:{
        type:String
    },

    price:{
        type:Number,
        required:true
    },

    stock:{
        type:Number,
        default:0
    },

    sku:{
        type:String,
        default:""
    },

    brand:{
        type:String,
        default:""
    },

    image:{
        type:String
    },

    /*
    =====================================
    DELHIVERY SHIPPING DETAILS
    =====================================
    */

    weight:{
        type:Number,
        required:true,
        default:500 // grams
    },

    length:{
        type:Number,
        default:15 // cm
    },

    width:{
        type:Number,
        default:10
    },

    height:{
        type:Number,
        default:5
    },

    hsnCode:{
        type:String,
        default:""
    },

    gstPercentage:{
        type:Number,
        default:18
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

export default mongoose.model("Product",productSchema);