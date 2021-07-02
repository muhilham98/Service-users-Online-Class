const mongoose = require("mongoose");
const User = require('../models/User');
const RefreshToken= require('../models/RefreshToken');
//const bcrypt = require('bcrypt');
const  Validator  = require('fastest-validator');
//const salt= 10;

const validator = new Validator();


module.exports = {

    create: async(req,res) => {
        const validate = validator.validate(req.body, {
            refresh_token: 'string',
            user_id: 'string'
        });
        if(validate.length) {
            return res.status(400).json({
                status:'error',
                message: validate
            });
        }

        const refreshToken = req.body.refresh_token;
        const userId = req.body.user_id;

        const validUserId = mongoose.Types.ObjectId.isValid(userId);
        if(!validUserId){
            return res.status(400).json({
                status: 'error',
                message: 'invalid id'
            });
        }

        const user = await User.findOne({ _id : userId });
        if(!user) {
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            });
        }

        const newRefreshToken = {
            refresh_token: refreshToken,
            user_id: userId
        }
        const createRefreshToken = await RefreshToken.create(newRefreshToken);

        return res.json({
            status: 'success',
            message: 'create refresh token successfully',
            data: {
                _id : createRefreshToken._id,
                refresh_token: createRefreshToken.refresh_token,
                user_id: createRefreshToken.user_id
            }
        })
    },

    getToken: async(req,res) => {

        const refreshToken = req.query.refresh_token;
        const token = await RefreshToken.findOne({ refresh_token: refreshToken });
        if(!token){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Token'
            });
        }

        return res.json({
            status : 'success',
            message: 'get refresh token successfully',
            token
        });
    }
    
}