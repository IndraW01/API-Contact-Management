import { logger } from "./application/logging.js";
import { web } from "./application/web.js";
import "dotenv/config"


web.listen(process.env.PORT, () => {
  logger.info('server is running in port ' + process.env.PORT);
})