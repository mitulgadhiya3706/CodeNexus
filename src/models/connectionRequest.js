const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",        //reference to the user collection 
        required: true, 
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{  timestamps: true }
)

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


/*check if connection request sent to yourself */
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    //check is fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can't send connection request to yourself.");
    }
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;    