import * as express from 'express';
import * as functions from 'firebase-functions';

const app = express();
app.get('*', (req: express.Request, res: express.Response) => {
  res.redirect('https://github.com/MichaelSolati/geofirestore');
});

export const github = functions.https.onRequest(app);
