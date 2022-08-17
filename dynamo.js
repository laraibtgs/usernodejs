const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "user-uxwcx6nwgzhilbvywe6c3kyqha-dev";

const getAllUser = async() =>{
    console.log("Getting All Users..!");
    const params = {
        TableName : TABLE_NAME
    };
    const characters = await dynamoClient.scan(params).promise();
    return characters;
}


const addOrUpdateUser = async (character) => {
    const params = {
        TableName : TABLE_NAME,
        Item : character
    };
  const user =  await dynamoClient.put(params).promise();

}

const deleteUser = async (id) => {
    const params = {
        TableName : TABLE_NAME,
        Key : {
            id
        }
    };
    await dynamoClient.delete(params).promise();

}

const getUserById = async(id) => {
    console.log("Getting User By ID..!")
    const params = {
        TableName : TABLE_NAME,
        Key : {
            id
        }
    }; 

    return await dynamoClient.get(params).promise();

}

module.exports = {
    dynamoClient,
    getAllUser,
    getUserById,
    addOrUpdateUser,
    deleteUser
}