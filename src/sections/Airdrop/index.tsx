import AirdropList from "./AirdropList";

export default function Airdrop() {

  return (
    <div className="mx-auto w-[1280px] rounded-2xl bg-white p-10">
      <div className="overflow-hidden rounded-xl">
        <video className="h-full w-full object-cover" src="./odyssey.mp4" muted loop autoPlay />
      </div>

      <div className="my-10 flex items-center justify-center gap-x-20 border-b border-b-[#EAEAEA] pb-3 text-xl font-bold leading-none text-[#7D7D7D]">
        <span className="cursor-pointer">All</span>
        <span className="cursor-pointer">Active</span>
        <span className="cursor-pointer">Upcoming</span>
        <span className="cursor-pointer">Closed</span>
      </div>

      <AirdropList />
    </div>
  );
}
