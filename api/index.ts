import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.use(express.static("public")) 
app.use(bodyParser.json());


app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
