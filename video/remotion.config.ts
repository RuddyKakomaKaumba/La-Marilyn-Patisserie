import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(18);
Config.setAudioCodec("aac");
Config.setAudioBitrate("256k");
Config.setOverwriteOutput(true);
