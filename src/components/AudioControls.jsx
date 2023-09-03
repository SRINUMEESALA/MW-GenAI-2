import React, { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { useSpeechRecognition } from "react-speech-kit";
import axios from "axios";
import MicIcon from "@mui/icons-material/MicNone";
import { IconButton } from "@mui/material";
import ThinkingBubble from "./ThinkingBubble";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import {
  TextField, // Add to imports
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/system";
import "./common.css";
import { useDispatch, useSelector } from "react-redux";

let timer;

const AudioControls = ({
  message,
  setMessage,
  isAudioResponse,
  handleSendMessage,
  messages,
  setMessages,
  handleBackendResponse,
}) => {
  const theme = useTheme();
  const [text, setText] = useState("");
  const { speak, cancel, speaking, voices } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setText(result);
    },
  });
  const audioWave = `${process.env.PUBLIC_URL}/audio-wave.gif`;
  const storeState = useSelector((state) => state);
  const counter = useSelector((state) => state.timer);

  useEffect(() => {
    if (storeState.disableChat) {
      speak({ text: " Please Wait till next one min to send message." });
    }
  }, [storeState.disableChat]);

  const handleRecording = () => {
    if (listening) {
      stop();
    } else {
      listen();
      cancel();
    }
  };

  useEffect(() => {
    let chat = {
      role: "assistant",
      text: "Hello! How can i assist you!",
      content: "hello",
    };
    setMessages((prev) => [...prev, chat]);
    speak({ text: chat.text });
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const apiCall = async () => {
    // Clear the input field
    setText("");

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />,
        text: <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />,
        key: "thinking",
      },
    ]);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://192.168.0.159:8002/",
        { query: text },
        config
      );

      setMessages((prevMessages) => {
        return prevMessages.filter((message) => message.key !== "thinking");
      });
      handleBackendResponse(data);
      speak({ text: data.result, voice: voices[144] });
    } catch (error) {
      setMessages((prevMessages) => {
        return prevMessages.filter((message) => message.key !== "thinking");
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: error.message,
          text: error.message,
        },
      ]);
      console.error("Error sending text message:", error);
    }
  };

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      stop();
      if (text !== "") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", content: text, text: text },
        ]);
        apiCall();
      }
    }, 1000);
  }, [text]);

  return (
    <TextFieldStyled
      disabled={storeState.disableChat}
      variant="outlined"
      fullWidth
      value={message}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      sx={{ marginBottom: "15px", marginTop: "15px" }}
      InputProps={{
        style: {
          color: "#ffffff",
          backgroundColor: "rgba(240,240,240,0.2)",
          marginBottom: "15px",
        },
        endAdornment: (
          <InputAdornment position="end">
            {storeState.disableChat ? (
              <p className="h5 text-white mt-2">{counter}</p>
            ) : message !== "" ? (
              <IconButton
                color="primary"
                onClick={() => handleSendMessage(isAudioResponse)}
                disabled={message.trim() === ""}>
                <SendIcon
                  style={{
                    width: 30,
                    height: 30,
                    color: `${storeState.disableChat ? "grey" : "white"}`,
                  }}
                />
              </IconButton>
            ) : !listening ? (
              <IconButton
                // color="warning"
                aria-label="start recording"
                onClick={handleRecording}
                disabled={listening || storeState.disableChat}>
                <MicIcon
                  style={{
                    width: 40,
                    height: 40,
                    color: `${storeState.disableChat ? "grey" : "white"}`,
                  }}
                />
              </IconButton>
            ) : (
              <div className="boxContainer" style={{ margin: "10px" }}>
                <div className="box box1"></div>
                <div className="box box2"></div>
                <div className="box box3"></div>
                <div className="box box4"></div>
                <div className="box box5"></div>
              </div>
            )}
          </InputAdornment>
        ),
      }}
      label="Type your message"
    />
  );
};

export default AudioControls;

const TextFieldStyled = styled(TextField)`
  & label.Mui-focused {
    color: white;
  }
  & label {
    color: rgba(255, 255, 255, 0.8);
  }
  & .MuiOutlinedInput-root {
    & fieldset: {
      bordercolor: "white";
    }
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;
