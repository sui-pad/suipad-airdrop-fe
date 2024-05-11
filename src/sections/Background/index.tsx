export default function Background() {
  return (
    <div className="fixed bottom-0 left-0 top-0 right-0 -z-10 w-full">
      <video className="h-full w-full object-cover" src="https://suipadstatic.s3.ap-southeast-1.amazonaws.com/airdrop/video.mp4" muted loop autoPlay></video>
    </div>
  );
}
