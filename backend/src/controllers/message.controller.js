import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary  from "../../lib/cloudinary.js"
import { getReceiverSocketId ,io} from '../../lib/socket.js';


export const getUsers = async (req, res) => {
try {
    const loggedUserId  =req.user._id;
    const filteredUsers  = await User.find({ _id : {$ne : loggedUserId}}).select("-password");
    res.status(200).json(filteredUsers);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
}
};

export const getMessages = async (req, res) => {
    try {
        const { user : userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { id: receiverId } = req.params;

        let imageUrl;
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};