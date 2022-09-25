import { contractAddresses, abi } from "../constants";
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [entranceFee, setEntranceFee] = useState("0");
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const dispatch = useNotification();

  const { runContractFunction: enterLottery } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, // specify the networkId
    functionName: "getEntranceFee",
    params: {},
  });

  //17:58:31

  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromCall);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
  };

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
    });
  };
  return (
    <div>
      LotteryEntrance
      {lotteryAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterLottery({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Enter Lottery
          </button>
          {ethers.utils.formatUnits(entranceFee, "ether")} ETH
        </div>
      ) : (
        <div>No Lottery address detected </div>
      )}
    </div>
  );
}
