import Web3Provider from "@/context/eth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}
