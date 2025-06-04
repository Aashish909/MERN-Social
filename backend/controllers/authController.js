    import {User}  from "../models/userModel.js";
    import generateToken from "../utils/generateToken.js";
    import getDataUrl from "../utils/urlGenerator.js";
    import bcrypt from "bcrypt";
    import cloudinary from "cloudinary";





    export const registerUser =async (req, res) => {
        try {

            const {name, email, password, gender} = req.body;

            const file=req.file;
            
            if(!name || !email || !password || !gender || !file){
                return res.status(400).json({
                    message: "Please fill all the fields"
                });
            }
            console.log("BODY:", req.body);
            console.log("FILE:", req.file);

            let user =await User.findOne({email})

            if(user){
                return res.status(400).json({
                    message: "User already exists"
                });
            }
            //create the url for the profile picture
            const fileUrl = getDataUrl(file)

            const hashedPassword =await bcrypt.hash(password, 10);

            const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content)

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                gender,  
                profilePic: {
                    id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            });

            generateToken(user._id, res);
            res.status(201).json({
                message: "User registered successfully",  
                user  
            });

        } catch (error) {
            res.status(500).json({
                message:error.message
            })
        }
    }

    export const loginUser =async(req, res)=>{

        try {
            const {email, password}=req.body || {}

            if(!email || !password){
                return res.status(400).json({
                    message: "Please fill all the fields"
                });
            }
            const user =await User.findOne({email})
            if(!user){
                return res.status(400).json({
                    message: "User does not exist"
                });
            }
            const comparedPassword = await bcrypt.compare(password, user.password);
            if(!comparedPassword){
                return res.status(400).json({
                    message: "Invalid password"
                });
            }
            generateToken(user._id, res);
            res.status(200).json({
                message: "User logged in successfully",
                user
            });
        } catch (error) {
            res.status(500).json({
            message: error.message,
            });
        }
    }

    export const logoutUser =async(req, res)=>{
        try {
            res.cookie('token', '', {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 0, // Set maxAge to 0 to delete the cookie
            });
            res.status(200).json({
                message: "Logged out successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }