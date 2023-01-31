import mongoose from 'mongoose';

const connectDB = (url) => {

    mongoose.set('strictQuery', true);

    mongoose.connect(url)
        .then(() => console.log('MongoDb connected'))
        .catch((error) => console.log(error));
}

export default connectDB;