import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, Pause, Square, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkyBackground from "@/components/SkyBackground";

const RecordingSession = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [sttSupported, setSttSupported] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const updateVolume = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    setVolumeLevel(Math.min(avg / 128, 1));
    animFrameRef.current = requestAnimationFrame(updateVolume);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // MediaRecorder
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();

      // Audio analyser
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      updateVolume();

      // Timer
      timerRef.current = setInterval(() => {
        setElapsedSeconds((p) => p + 1);
      }, 1000);

      // Speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onresult = (e: any) => {
          let finalText = "";
          for (let i = 0; i < e.results.length; i++) {
            finalText += e.results[i][0].transcript + " ";
          }
          setTranscript(finalText.trim());
        };
        recognition.onerror = () => {};
        recognition.start();
        recognitionRef.current = recognition;
      } else {
        setSttSupported(false);
      }

      setIsRecording(true);
      setIsPaused(false);
    } catch {
      // mic permission denied
    }
  }, [updateVolume]);

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      recognitionRef.current?.start();
      timerRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
      updateVolume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      recognitionRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      cancelAnimationFrame(animFrameRef.current);
      setVolumeLevel(0);
      setIsPaused(true);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    navigate(-1);
  };

  useEffect(() => {
    startRecording();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cancelAnimationFrame(animFrameRef.current);
      recognitionRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startRecording]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col safe-top safe-bottom">
      <SkyBackground />

      {/* Header */}
      <div className="pt-14 pb-4 px-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-muted-foreground active:opacity-60 transition-opacity"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Recording</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pb-8">
        {/* Mic + vertical volume meter */}
        <div className="flex items-end gap-4 mt-8">
          {/* Vertical volume bar */}
          <div className="w-3 h-32 rounded-full bg-muted/50 overflow-hidden flex flex-col justify-end">
            <div
              className="w-full rounded-full bg-primary transition-all duration-75"
              style={{ height: `${volumeLevel * 100}%` }}
            />
          </div>

          {/* Pulsing mic */}
          <div className="relative flex items-center justify-center">
            {isRecording && !isPaused && (
              <div className="absolute w-24 h-24 rounded-full bg-destructive/20 animate-ping" />
            )}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isRecording && !isPaused ? "bg-destructive" : "bg-muted"
            }`}>
              <Mic className="size-8 text-destructive-foreground" />
            </div>
          </div>

          {/* Vertical volume bar (mirrored) */}
          <div className="w-3 h-32 rounded-full bg-muted/50 overflow-hidden flex flex-col justify-end">
            <div
              className="w-full rounded-full bg-primary transition-all duration-75"
              style={{ height: `${volumeLevel * 100}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <p className="text-4xl font-mono font-bold text-foreground mt-6">
          {formatTime(elapsedSeconds)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {isPaused ? "Paused" : isRecording ? "Recording..." : "Starting..."}
        </p>

        {/* Transcript */}
        <div className="w-full mt-8 flex-1 max-h-[30vh] overflow-y-auto rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Live Transcript</p>
          {transcript ? (
            <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {sttSupported ? "Start speaking to see your words appear here..." : "Speech-to-text not supported in this browser."}
            </p>
          )}
          <div ref={transcriptEndRef} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-8">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={togglePause}
            disabled={!isRecording}
          >
            {isPaused ? <Play className="size-6" /> : <Pause className="size-6" />}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={stopRecording}
            disabled={!isRecording}
          >
            <Square className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordingSession;
