import express  from 'express'
import { UbiquityClient, NETWORKS, PROTOCOL,  WS_CHANNELS, UbiWebsocket, BlockItem, } from "./client";
import WebSocket from "isomorphic-ws";
import * as ethBlock from "../test/data/eth_block.json"

  
  let ubiWs: UbiWebsocket;
  let server: WebSocket.Server;
  

const TOKEN = "bd1bweU4Nx6z0qu2qdMo7m7zavMlpxA8zQPbC1Hvm9NUdmZ";



const app = express()

const client  = new UbiquityClient(TOKEN);

app.get('/ws', async (req, res) => {
    
    const events: any[] = [];
    server = await new Promise<WebSocket.Server>((resolve, rejects) => {
      const wss = new WebSocket.Server(
        { host: "localhost", port: 0, path: "/ethereum/mainnet/websocket" },
        () => resolve(wss)
      ) as WebSocket.Server;
  
      wss.on("connection", (ws: WebSocket) => {
        console.log("connected");
        ws.on("message", (message: any) => {
          const e = JSON.parse(message.toString());
          events.push(e);
          console.log("server got message %s", message);
          if (e.method === "ubiquity.subscribe") {
            ws.send(
              JSON.stringify({
                id: 1,
                result: {
                  subID: 123,
                },
              })
            );
            ws.send(
              JSON.stringify({
                method: "ubiquity.subscription",
                params: {
                  items: [
                    {
                      subID: 123,
                      channel: "ubiquity.block",
                      revert: false,
                      content: ethBlock,
                    },
                  ],
                },
              })
            );
          }
          if (e.method === "ubiquity.unsubscribe") {
            ws.send(
              JSON.stringify({
                id: 2,
                result: {
                  removed: true,
                },
              })
            );
          }
        });
      });
    });
    
})

app.get('/balance', async(req, res) => {
    const balance:any = await client.accountsApi.getListOfBalancesByAddress(
        PROTOCOL.ETHEREUM,
        NETWORKS.MAIN_NET,
        "0xE6451Ab8fE00D9bF197fd71DC4006a4151A205dB"
      );
      res.json({
          "balance": balance.data
      })
})

app.get("/", async (req, res) => {
    const block = await client.blocksApi.getBlock(
        PROTOCOL.ETHEREUM,
        NETWORKS.MAIN_NET,
        "00000000000000000001a031c7ff632e6a8c1d95852468aaa17d8cacde17b6de"
      );
    return res.json({
        block
    })
})


const port = Number(process.env.PORT ?? 3000);

app.listen(port, '0.0.0.0',  () => {

    console.log(`server started at http://localhost:${port}`);

})


