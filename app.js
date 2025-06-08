import express from 'express';
import blockRoutes from './routes/blockRoutes.js';
import { errorHandler } from './utils/errorHandler.js';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/blocks', blockRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`NodeChain API server started on port ${PORT}`);
});

export default app;
