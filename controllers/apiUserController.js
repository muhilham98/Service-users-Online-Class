const mongoose = require("mongoose");
const User = require('../models/User');
const RefreshToken= require('../models/RefreshToken');
const bcrypt = require('bcrypt');
const  Validator  = require('fastest-validator');
const salt= 10;

const validator = new Validator();


module.exports = {

    register: async(req,res) => {

        const validate = validator.validate(req.body, {
            name: 'string|empty:false',
            email: 'email|empty:false',
            password: 'string|empty:false|min:8',
            skill: 'string|optional',
            role: 'string|optional'
        });

        if(validate.length) {
            return res.status(400).json({
                status:'error',
                message: validate
            });
        };

        const { name, email,password, skill, role } = req.body;


        const user = await User.findOne({ email: email});
        if(user){
            return res.status(409).json({
                status:'error',
                message: 'email already exists'
            });
        }

        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = {
            name,
            email,
            password: passwordHash,
            skill,
            role
          }
        const addUser = await User.create(newUser);

        return res.json({
            status: 'success',
            message: 'register successfully',
            data: {
                _id: addUser._id
            }
        })
       
    },

    login: async(req,res) => {
        
        const validate = validator.validate(req.body, {
            email: 'email|empty:false',
            password: 'string|empty:false|min:8'
        });
        if(validate.length) {
            return res.status(400).json({
                status:'error',
                message: validate
            });
        };

        const { email,password } = req.body;

        const user = await User.findOne({ email: email});
        if(!user){
            return res.status(401).json({
                status: 'error',
                message: 'user not found'
            });
        };

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                status: 'error',
                message: 'password invalid'
            });
        };

        //console.log(user.image_profile)

        return res.json({
            status: 'success',
            message: 'login successfully',
            data: {
                _id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                image_profile: user.image_profile,
                skill: user.skill
                
            } 
        })

    },

    update: async(req,res) => {

        const validate = validator.validate(req.body, {
            name: 'string|empty:fales',
            email: 'email|empty:false',
            password: 'string|min:8|empty:false',
            skill: 'string|optional',
            image_profile : 'string|optional'
        });
        if(validate.length) {
            return res.status(400).json({
                status:'error',
                message: validate
            });
        }

        const { name, email, password, skill, image_profile } = req.body;
        const { id } = req.params;

        const validUserId = mongoose.Types.ObjectId.isValid(id);
        if(!validUserId){
            return res.status(400).json({
                status: 'error',
                message: 'invalid id'
            });
        }

        const user = await User.findOne({ _id: id });
        if(!user){
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }

        if (email){
            const checkEmail = await User.findOne({ email: email });
            if(checkEmail && email !== user.email){
                return res.status(409).json({
                    status: 'error',
                    message: 'email already exists'
                });
            };
        }

        const passwordHash = await bcrypt.hash(password, salt);

        user.email = email;
        user.password = passwordHash;
        user.name = name;
        user.skill = skill;
        user.image_profile = image_profile;
        await user.save();
        
        return res.json({
            status: 'success',
            message: 'update successfully',
            data: {
                _id: user._id,
                email,
                name,
                skill,
                image_profile
            }
        });

    },

    getUser: async(req,res) => {
        const { id } = req.params;

        const validUserId = mongoose.Types.ObjectId.isValid(id);
        if(!validUserId){
            return res.status(400).json({
                status: 'error',
                message: 'invalid id'
            });
        }

        const user = await User.findOne({ _id: id })
            .select('id name email role skill image_profile');
        if(!user){
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }

        return res.json({
            status: 'success',
            message: 'get user successfully',
            data: user
        });
       
    },

    getUsers: async(req,res) => {

        const ids = req.query.user_ids || [];
        //console.log(typeof ids);

        for(let i = 0; i<ids.length; i++)
        {
            const validUserId = mongoose.Types.ObjectId.isValid(ids[i]);
            if(!validUserId){
                return res.status(400).json({
                    status: 'error',
                    message: `invalid id ${ids[i]}`
                });
            }      
        }

        if(ids.length){
            const users = await User.find({ '_id': { $in: ids } })
                .select('id name email role skill image_profile');
            return res.json({
                status: 'success',
                message: 'get users successfully',
                data: users
            });
        }else{
            const users = await User.find()
                .select('id name email role skill image_profile');
            return res.json({
                status: 'success',
                message: 'get all users successfully',
                data: users
            });
        }
    },

    logout: async(req,res) => {
        // const userId = req.body.user_id;

        // const validUserId = mongoose.Types.ObjectId.isValid(userId);
        // if(!validUserId){
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'invalid id'
        //     });
        // }

        const refreshToken = req.body.refresh_token;
        //console.log(refreshToken);

        const refresh_token = await RefreshToken.findOne({ refresh_token: refreshToken });
        if(!refresh_token){
            return res.status(404).json({
                status: 'error',
                message: 'token not found'
            });
        }

        await refresh_token.remove();
        

        return res.json({
            status: 'success',
            message: 'logout successfully'
        })
    }
    
}