import { useState, useRef, useEffect } from "react";
import Video from "./assets/Hollow Knight_ Silksong.mp4";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsFullscreen,
  BsVolumeMute,
  BsVolumeUp,
} from "react-icons/bs";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<SVGSVGElement | null>(null);
  const [play, setPlay] = useState(false);
  const [fullWidth, setFullWidth] = useState(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [track, setTrack] = useState(0);
  const [mute, setMute] = useState(false);

  const playPause = () => {
    if (!videoRef.current) return;
    if (duration === 0 && progressRef.current) {
      setFullWidth(progressRef.current.scrollWidth);
      setDuration(videoRef.current.duration);
    }

    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlay(true);
      return;
    }

    videoRef.current.pause();
    setPlay(false);
  };

  const fullScreen = () => {
    videoRef.current?.requestFullscreen();
  };

  const handleSVGClick = (event) => {
    // Handle the click event and get the coordinates
    const svg = event.target;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformedPoint = point.matrixTransform(
      svg.getScreenCTM().inverse()
    );

    // Log the coordinates
    const turn = transformedPoint.x;

    if (!videoRef.current) return;
    const onePoint = fullWidth / duration;
    const calc = turn / onePoint;
    videoRef.current.currentTime = calc;
    setProgress(calc);
    setTrack(turn);
  };

  useEffect(() => {
    if (fullWidth && duration && progress) {
      const calc = (fullWidth / duration) * progress;
      setTrack(+calc);
    }
  }, [progress]);

  useEffect(() => {
    if (!videoRef.current) return;

    const updateTimeProgress = () => {
      if (!videoRef.current) return;
      setProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * duration
      );
    };

    videoRef.current.addEventListener("timeupdate", updateTimeProgress);

    return () => {
      if (!videoRef.current) return;
      videoRef.current.removeEventListener("timeupdate", updateTimeProgress);
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-screen bg-black">
      <div className="w-[720px] border-8 border-neutral-300 relative pb-12">
        <video onClick={playPause} ref={videoRef} width="720" muted={mute}>
          <source src={Video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute bottom-0 h-12 w-full bg-neutral-300 flex justify-between items-center gap-3">
          <button
            className="bg-black/70 p-1 rounded-full text-neutral-300"
            onClick={playPause}
          >
            {play ? (
              <BsFillPauseCircleFill className={"w-6 h-6"} />
            ) : (
              <BsFillPlayCircleFill className={"w-6 h-6"} />
            )}
          </button>

          <button
            onClick={() => setMute(!mute)}
            className="bg-black rounded-full text-neutral-300 p-1 "
          >
            {mute ? (
              <BsVolumeMute className={"w-6 h-6"} />
            ) : (
              <BsVolumeUp className={"w-6 h-6"} />
            )}
          </button>

          <svg
            className="w-full h-6 rounded-full bg-black/70"
            ref={progressRef}
            onClick={handleSVGClick}
          >
            <rect
              className="h-6"
              width={track}
              x={0}
              y={0}
              style={{ fill: "red", opacity: 0.5, pointerEvents: "none" }}
            />
          </svg>
          <button
            className="bg-black/70 p-2 rounded-full text-neutral-300"
            onClick={fullScreen}
          >
            <BsFullscreen className={"w-4 h-4"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// GoPlay
