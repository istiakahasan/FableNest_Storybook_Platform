import { Server } from "http";
import app from "./app";
import config from "./config";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { StaticConfigService } from "./app/modules/staticConfig/static.config.service";

let server: Server;

async function main() {
  server = app.listen(config.port, () => {
    seedSuperAdmin()
    StaticConfigService.seedStaticConfig()
    console.log("FableNest Server is running on port ", config.port);
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
