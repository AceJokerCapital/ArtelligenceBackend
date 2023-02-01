import express from 'express'; //external libraies
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';//inernal libraries
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'



dotenv.config();


const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

//an api endpoint is like a home directory within it many api requests will be executed such as get post etc. to that endpoint

app.use('/api/v1/post-x', postRoutes); //created api endpoints or access route like app.get is using the '/' route this will use the '/api/v1/post' to execute queries 
app.use('/api/v1/dalle-x', dalleRoutes);



app.get('/', async (req, res) => { //created an endpoint '/' or route
    res.send('Welcome To Artilligence Backend');
});

const startserver = async () => {

    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(10000, () => console.log('Server has started on port http://localhost:10000'))
    } catch (error) {
        console.log(error);

    }


}

startserver();