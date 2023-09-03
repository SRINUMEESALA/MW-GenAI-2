import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import {
  Box, // Add to imports
  Container,
  Dialog,
  DialogTitle,
  List, // Add to imports
  ListItem, // Add to imports
  ListItemText, // Add to imports
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./App.css";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import AudioControls from "./components/AudioControls";
import MessageInput from "./components/MessageInput";
import ThinkingBubble from "./components/ThinkingBubble";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { UpdateApiCallsCount } from "./redux/action";

let timerM;
function App() {
  const theme = useTheme();

  const mock = [
    {
      role: "user",
      text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos, quasi.     Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos, quasi      ",
      content: "hello",
    },
    {
      role: "assistant",
      text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos, quasi. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos, quasi",
      content: "hello",
    },
    {
      role: "assistant",
      content: <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />,
      text: <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />,
      key: "thinking",
    },
  ];

  const [messages, setMessages] = useState([]);
  const [countAPIcalls, setCountAPIcalls] = useState(0);
  const [message, setMessage] = useState("");
  const [isAudioResponse, setIsAudioResponse] = useState(false);
  const [disableChat, setDisableChat] = useState(false);
  const [count, setCount] = useState(60);
  const storeState = useSelector((state) => state);
  const dispatch = useDispatch();
  console.log("after Update", storeState);
  const handleSendMessage = async () => {
    if (storeState.apiCallsCount === 3) {
      // setTimeout(() => {
      //   dispatch(
      //     UpdateApiCallsCount({
      //       apiCallsCount: 0,
      //       disableChat: false,
      //       timer: 60,
      //     })
      //   );
      //   clearInterval(timer);
      // }, 60000);
      timerM = setInterval(() => {
        console.log("before dispatching", {
          apiCallsCount: 3,
          disableChat: true,
          timer: storeState.timer - 1,
        });
        dispatch(
          UpdateApiCallsCount({
            apiCallsCount: 3,
            disableChat: true,
            timer: storeState.timer - 1,
          })
        );
      }, 1000);
      setMessage("");
      // alert("Limit Reached! Please try after one min.");
      return;
    }

    dispatch(
      UpdateApiCallsCount({
        apiCallsCount: storeState.apiCallsCount + 1,
        disableChat: false,
        timer: 60,
      })
    );
    if (message.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: message, text: message },
      ]);

      // Clear the input field
      setMessage("");

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: (
            <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />
          ),
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
          { query: message },
          config
        );

        setMessages((prevMessages) => {
          return prevMessages.filter((message) => message.key !== "thinking");
        });
        handleBackendResponse(data);
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
    }
  };

  const handleBackendResponse = (response) => {
    const generatedText = response.result;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: generatedText,
        text: generatedText,
      },
    ]);
  };

  const bgVideo = `${process.env.PUBLIC_URL}/bg-video.mp4`;

  return (
    <>
      <BB className="content">
        <BgVideo loop muted={true} autoPlay>
          <source src={bgVideo} type="video/mp4" />
        </BgVideo>
      </BB>
      {/* <BgImageContainer> */}
      <Container maxWidth="xl" sx={{ padding: 0 }}>
        <ChatHeader />
      </Container>
      <Container
        maxWidth="sm"
        sx={{
          pt: 0,
          position: "relative",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}>
        <ChatMessages messages={messages} />
        <AudioControls
          messages={messages}
          setMessages={setMessages}
          handleBackendResponse={handleBackendResponse}
          message={message}
          setMessage={setMessage}
          setIsAudioResponse={setIsAudioResponse}
          handleSendMessage={handleSendMessage}
        />
      </Container>
      {/* </BgImageContainer> */}
    </>
  );
}

export default App;

const BgImageContainer = styled("div")`
  height: 100vh;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-image: url(${process.env.PUBLIC_URL}/bg-image.png);
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.5);
  height: 100%;
`;

const BgVideo = styled("video")`
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

const BgOuter = styled("div")`
  .blur-bg::before {
    // content: '';
    // position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    // z-index: 1;
    background: linear-gradient(
      to right,
      rgba(65, 0, 255, 0.4),
      rgba(255, 0, 232, 0.3)
    );
  }
`;

const BB = styled("div")`
  .content {
    position: relative;
    width: 100%;
    width: 500px;
    margin: 0 auto;
    padding: 20px;
  }
  .content video {
    // width: 100%;
    // display: block;
  }
  .content:before {
    content: "";
    position: absolute;
    background-color: red;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;
