import { Chat } from "../models/chatModel.js";
import { Messages } from "../models/messagesModel.js";
import { getRecieverSocketId, io } from "../socket/socket.js";




export const sendMessage = async (req, res) => {
  try {
    const { recieverId, message } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const senderId = req.user._id;

    if (!recieverId) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide a recieverId" });
    }

    let chat = await Chat.findOne({
      users: { $all: [senderId, recieverId] },
    });

    if (!chat) {
      chat = new Chat({
        users: [senderId, recieverId],
        latestMessage: {
          text: message,
          sender: senderId,
        },
      });
      await chat.save();
    }

    const newMessage = new Messages({
      chatId: chat._id,
      sender: senderId,
      text: message,
    });
    await newMessage.save();

    await chat.updateOne({
      latestMessage: {
        text: message,
        sender: senderId,
      },
    });

    //realtime Chat
    const recieverSocketId = getRecieverSocketId(recieverId);

    if(recieverSocketId){
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAllMessages =async(req, res)=>{
    try {
        const {id} =req.params;
        const userId =req.user._id;

        const chat = await Chat.findOne({
            users: { $all: [userId, id] },
        })
        if(!chat){
            return res.status(404).json({
                success: false,
                message: "Chat not found with this user"
            })
        }
        const messages = await Messages.find({chatId: chat._id});
       
        res.status(200).json({
            success: true,
            messages
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// export const getAllChats =async(req, res)=>{
//     try {
//         const chats = await Chat.find({})
//         res.status(200).json({
//             success: true,
//             chats
//             })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

