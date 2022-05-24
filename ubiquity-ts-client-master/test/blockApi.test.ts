import { UbiquityClient, NETWORKS, PROTOCOL } from "../src/client";
import globalAxios from "axios";
import * as btcBlock from "./data/btc_block.json";
import * as ethBlock from "./data/eth_block.json";
import * as ethBlockIdent from "./data/eth_block_id.json";
jest.mock("axios");

const client = new UbiquityClient("---> Auth Token Here");

afterEach(() => {
  (globalAxios.request as any).mockClear();
});

test("fetches btc block successfully data from an API", async () => {
  (globalAxios.request as any).mockImplementation(() =>
    Promise.resolve({ status: 200, data: btcBlock })
  );

  const block = await client.blocksApi.getBlock(
    PROTOCOL.BITCOIN,
    NETWORKS.MAIN_NET,
    "00000000000000000001a031c7ff632e6a8c1d95852468aaa17d8cacde17b6de"
  );

  expect(globalAxios.request).toBeCalledTimes(1);
  expect(block.data).toEqual(btcBlock);
});

test("fetches eth block successfully data from an API", async () => {
  (globalAxios.request as any).mockImplementation(() =>
    Promise.resolve({ status: 200, data: ethBlock })
  );

  const block = await client.blocksApi.getBlock(
    PROTOCOL.ETHEREUM,
    NETWORKS.MAIN_NET,
    "00000000000000000001a031c7ff632e6a8c1d95852468aaa17d8cacde17b6de"
  );

  expect(globalAxios.request).toBeCalledTimes(1);
  expect(block.data).toEqual(ethBlock);
});

test("fetches eth current block identity successfully data from an API", async () => {
  (globalAxios.request as any).mockImplementation(() =>
    Promise.resolve({ status: 200, data: ethBlockIdent })
  );

  const BlockIdentifier = await client.blocksApi.getBlockIdentifier(
    "ethereum",
    "mainnet",
    "12560663"
  );

  expect(globalAxios.request).toBeCalledTimes(1);
  expect(BlockIdentifier.data).toEqual(ethBlockIdent);
});
