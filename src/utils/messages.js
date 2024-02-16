const messageModel = require("../models/messages.model");

const getToken = (sender, receiver) => {
    const key= [sender,receiver].sort().join("_")
    return key;
}
const saveMessages = async ({from, to, message, time}) => {
    const token = getToken(from,to);
    const data = {
        from,message,time
    }

    messageModel.updateOne({userToken: token}, {$push: {messages: data}})
    .then((res) => {console.log('메세지 생성')})
    .catch(err => {console.error(err)})
}
const fetchMessages = async (io, sender, receiver ) => {
    const  token = getToken(sender, receiver);
    const foundToken = await messageModel.findOne({userToken: token});
    if(foundToken) {
        io.to(sender).emit('stored-messages', {messages: foundToken.messages});
    } else {
        const data = {
            userToken: token,
            messages: []
        }
        const message = new messageModel(data);
        const savedMessage = message.save();
        if(savedMessage){
            console.log('생성 잘됨');
        } else {
            console.log('생성 실패')
        }
    }
}
module.exports = { saveMessages ,fetchMessages}