export default function DemoVideo() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Demo Video</h1>

      <video
        src="/videos/demo-videos.mp4"
        controls
        style={{ width: "100%", maxWidth: "800px", borderRadius: "10px" }}
      />
    </div>
  );
}

