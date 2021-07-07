import 'babel-polyfill';
import { makeExecutableSchema } from 'apollo-server';
import configuration from './config/configuration';
import schema from "./index";
import Server from './libs/Server';

const server = new Server(configuration);

const initServer = () => {
  server.bootstrap()
    .setupApollo({ schema: makeExecutableSchema(schema) });
    server.setupRoutes();
}

initServer()


export default server;
