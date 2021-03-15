declare module "node-rtsp-stream" {
  declare class VideoStream {
    constructor(opst: {
      name: string;
      streamUrl: string;
      width?: number;
      height?: number;
      wsPort: number;
      ffmpegOptions: { [key: string]: unknown };
    });

    name: string;
    streamUrl: string;
    width: number;
    height: number;
    wsPort: number;
    inputStreamStarted: boolean;
    stop: () => void;
    startMpeg1Stream: () => void;
    pipeStreamToSocketServer: () => void;
    onSocketConnect: (socket: WebSocket, request: unknown) => void;
  }

  export = VideoStream;
}
