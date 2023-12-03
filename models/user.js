const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        avatarURL: String,
        token: String,
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
      },
      
      { versionKey: false, timestamps: true }
)

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
  });
  
  const updateSchema = Joi.object({
    subscription: Joi.string().allow("starter", "pro", "business"),
  });

  const verifyShema = Joi.object({
    email: Joi.string().required(),
  });

  const schemas = {
    schema,
    updateSchema,
    verifyShema
  };

  
  const User = mongoose.model("user", userSchema);
  
  module.exports = {
    User,
    schemas,
  };

