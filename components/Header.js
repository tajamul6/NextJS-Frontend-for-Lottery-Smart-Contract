import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div>
      Decentralized Web3 Lottery
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
