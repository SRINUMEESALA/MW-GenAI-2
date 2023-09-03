import React, {
  useEffect, // Add to imports
  useRef, // Add to imports
} from "react";
import {
  Box, // Add to imports
  Container,
  List, // Add to imports
  ListItem, // Add to imports
  ListItemText, // Add to imports
  Paper, // Add to imports
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

const ChatMessages = ({ messages }) => {
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const theme = useTheme();
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      if (typeof bottomRef.current.scrollIntoViewIfNeeded === "function") {
        bottomRef.current.scrollIntoViewIfNeeded({ behavior: "smooth" });
      } else {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  const botAva = `${process.env.PUBLIC_URL}/favicon.png`;
  const userAva = `${process.env.PUBLIC_URL}/userAva.svg`;

  return (
    <Container>
      <Box
        sx={{
          width: "100%",
          mt: 2,
          maxHeight: 500,
          minHeight: 500,
          overflow: "auto",
          /* Apply the custom scrollbar styles */
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            marginTop: "20px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(240,240,240,0.5)",
            borderRadius: "15px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(255,255,255,0.8)",
          },
        }}>
        <Paper
          elevation={0}
          style={{ backgroundColor: "rgba(0,0,0,0)", marginTop: "20px" }}>
          {messages.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center">
              <h1 className="h5 text-secondary">Start a new conversation!</h1>
            </div>
          ) : (
            <List>
              {messages.map((message, index) => (
                <ListItem key={index} sx={{ padding: 0 }}>
                  <ListItemText
                    sx={{ margin: 0 }}
                    primary={
                      <MessageWrapper align={message.role}>
                        {message.role === "user" ? (
                          <>
                            <UserMessage theme={theme} audio={message.audio}>
                              {message.text}
                            </UserMessage>
                            <Ava>
                              <img src={userAva} alt="ava" />
                            </Ava>
                          </>
                        ) : (
                          <>
                            <Ava>
                              <img src={botAva} alt="ava" />
                            </Ava>
                            <AgentMessage theme={theme}>
                              {message.text}
                            </AgentMessage>
                          </>
                        )}
                      </MessageWrapper>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          <div ref={bottomRef} />
        </Paper>
      </Box>
    </Container>
  );
};

export default ChatMessages;

const UserMessage = styled("div", {
  shouldForwardProp: (prop) => prop !== "audio",
})`
  position: relative;
  // background-color: ${({ theme }) => theme.palette.primary.main};
  background-image: linear-gradient(93deg, #53b2fe, #065af3);
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: ${({ theme }) => theme.spacing(1, 2)};
  padding-right: ${({ theme, audio }) =>
    audio ? theme.spacing(6) : theme.spacing(2)};
  border-radius: 1rem;
  border-top-right-radius: 0;
  align-self: center;
  max-width: 70%;
  word-wrap: break-word;
  margin-right: 10px;
`;

const AgentMessage = styled("div")`
  position: relative;
  // background-color: ${({ theme }) => theme.palette.grey[300]};
  // background-image:
  background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  color: ${({ theme }) => theme.palette.text.primary};
  padding: ${({ theme }) => theme.spacing(1, 2)};
  border-radius: 1rem;
  border-top-left-radius: 0;
  align-self: center;
  max-width: 70%;
  word-wrap: break-word;
  margin-left: 10px;
`;

const MessageWrapper = styled("div")`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  justify-content: ${({ align }) =>
    align === "user" ? "flex-end" : "flex-start"};
  margin: 5px 10px 0 10px;
`;

const Ava = styled("div")`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  display: none;

  img {
    height: 100%;
    border-radius: 50%;
  }

  @media screen and (min-width: 425px) {
    display: block;
  }
`;
