import React, { FC, useCallback, useEffect, useState } from "react";
import {
  AudioBuffer,
  AudioManager,
  RecordingNotificationManager,
} from "react-native-audio-api";

import { Alert, StyleSheet, View } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import { audioRecorder as Recorder, audioContext } from "./singletons";
import ControlPanel from "./ControlPanel";
import RecordingVisualization from "./RecordingVisualization";
import { RecordingState } from "./types";

const Record: FC = () => {
  const [state, setState] = useState<RecordingState>(RecordingState.Idle);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [recordedBuffer, setRecordedBuffer] = useState<AudioBuffer | null>(
    null,
  );
  const currentPositionSV = useSharedValue(0);

  const updateNotification = (paused: boolean) => {
    RecordingNotificationManager.show({
      paused,
    });
  };

  const setupNotification = (paused: boolean) => {
    RecordingNotificationManager.show({
      title: "Recording Demo",
      contentText: paused ? "Paused recording" : "Recording...",
      paused,
      smallIconResourceName: "logo",
      pauseIconResourceName: "pause",
      resumeIconResourceName: "resume",
      color: 0xff6200,
    });
  };

  const onStartRecording = useCallback(async () => {
    if (state !== RecordingState.Idle) {
      return;
    }

    setState(RecordingState.Loading);

    if (!hasPermissions) {
      const permissionStatus = await AudioManager.requestRecordingPermissions();

      if (permissionStatus !== "Granted") {
        Alert.alert("Error", "Recording permissions are no't granted");
        return;
      }

      setHasPermissions(true);
    }

    let success = false;
    AudioManager.setAudioSessionOptions({
      iosCategory: "playAndRecord",
      iosMode: "default",
      iosOptions: ["defaultToSpeaker", "allowBluetoothA2DP"],
    });

    try {
      success = await AudioManager.setAudioSessionActivity(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to activate audio session for recording.");
      setState(RecordingState.Idle);
      return;
    }

    if (!success) {
      Alert.alert("Error", "Failed to activate audio session for recording.");
      setState(RecordingState.Idle);
      return;
    }

    const result = Recorder.start({
      fileNameOverride: `overridden_name_${Date.now()}`,
    });

    setupNotification(false);

    if (result.status === "success") {
      console.log("Recording started, file path:", result.path);
      setState(RecordingState.Recording);
      return;
    }

    console.log("Recording start error:", result);
    Alert.alert("Error", `Failed to start recording: ${result.message}`);
    setState(RecordingState.Idle);
  }, [state, hasPermissions]);

  const onPauseRecording = useCallback(() => {
    Recorder.pause();
    updateNotification(true);
    setState(RecordingState.Paused);
  }, []);

  const onResumeRecording = useCallback(() => {
    Recorder.resume();
    updateNotification(false);
    setState(RecordingState.Recording);
  }, []);

  const onStopRecording = useCallback(async () => {
    const info = Recorder.stop();
    RecordingNotificationManager.hide();
    setState(RecordingState.Idle);

    if (info.status !== "success") {
      Alert.alert("Error", `Failed to stop recording: ${info.message}`);
      setRecordedBuffer(null);
      return;
    }

    const audioBuffer = await audioContext.decodeAudioData(info.path);
    setRecordedBuffer(audioBuffer);
  }, []);

  const onToggleState = useCallback(
    (action: RecordingState) => {
      if (state === RecordingState.Paused) {
        if (action === RecordingState.Recording) {
          onResumeRecording();
          return;
        }
      }

      if (action === RecordingState.Recording) {
        onStartRecording();
        return;
      }

      if (action === RecordingState.Paused) {
        onPauseRecording();
        return;
      }

      if (action === RecordingState.Idle) {
        if (state === RecordingState.Recording) {
          onStopRecording();
        }
        return;
      }

      if (action === RecordingState.ReadyToPlay) {
        onStopRecording();
        return;
      }
    },
    [
      state,
      onStartRecording,
      onPauseRecording,
      onStopRecording,
      onResumeRecording,
    ],
  );

  useEffect(() => {
    (async () => {
      const permissionStatus = await AudioManager.checkRecordingPermissions();

      if (permissionStatus === "Granted") {
        setHasPermissions(true);
      }
    })();
  }, []);

  useEffect(() => {
    const pauseListener = RecordingNotificationManager.addEventListener(
      "recordingNotificationPause",
      () => {
        console.log("Notification pause action received");
        onPauseRecording();
      },
    );

    const resumeListener = RecordingNotificationManager.addEventListener(
      "recordingNotificationResume",
      () => {
        console.log("Notification resume action received");
        onResumeRecording();
      },
    );

    return () => {
      pauseListener.remove();
      resumeListener.remove();
      RecordingNotificationManager.hide();
    };
  }, [onPauseRecording, onResumeRecording]);

  useEffect(() => {
    Recorder.enableFileOutput();

    return () => {
      Recorder.disableFileOutput();
      Recorder.stop();
      AudioManager.setAudioSessionActivity(false);
      RecordingNotificationManager.hide();
    };
  }, []);

  return (
    <>
      <RecordingVisualization state={state} />
      <View style={styles.spacerM} />
      <ControlPanel state={state} onToggleState={onToggleState} />
    </>
  );
};

export default Record;

const styles = StyleSheet.create({
  spacerM: { height: 24 },
  spacerS: { height: 12 },
});
