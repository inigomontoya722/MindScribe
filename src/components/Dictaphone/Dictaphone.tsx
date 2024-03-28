// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { template } from "./Dictaphone.constants";
import Presentation from "../Presentation";
import { cn } from "@bem-react/classname";

import "./Dictaphone.scss";

const cnDictaphone = cn("Dictaphone");

const Dictaphone = () => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [visibleText, setVisibleText] = useState(true);
  const [text, setText] = useState<string>("");
  const [timer, setTimer] = useState();

  const timeoutCallback = () => {
    handleSendRequest(transcript);
    setTimer(setTimeout(timeoutCallback, 6000));
  };

  const hints = useMemo(() => {
    const responses = messages
      .slice(1)
      .reduce((acc, { message, sender }, index) => {
        if (sender !== "user") acc.push(<p key={index}>{message}</p>);
        return acc;
      }, []);
    return responses[responses.length - 1];
  }, [messages]);

  const handleSendRequest = async (message: string) => {
    const newMessage = {
      message: template(text, message),
      direction: "outgoing",
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      console.log(response);
      const content = response?.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className={cnDictaphone("Page")}>
      <Presentation />
      <textarea
        value={text}
        onInput={(t) => {
          setText(t.target.value);
        }}
        rows={20}
        cols={100}
        style={{
          resize: "none",
          display: visibleText ? "block" : "none",
        }}
      />
      <p>Microphone: {listening ? "on" : "off"}</p>
      <div className={cnDictaphone("Controllers")}>
        <button
          className={cnDictaphone("Button")}
          onClick={() => {
            SpeechRecognition.startListening({ continuous: true });
            setTimer(setTimeout(timeoutCallback, 1000));
          }}
        >
          Start
        </button>
        <button
          className={cnDictaphone("Button")}
          onClick={() => {
            SpeechRecognition.stopListening();
            clearTimeout(timer);
          }}
        >
          Stop
        </button>
        <button
          className={cnDictaphone("Button")}
          onClick={() => {
            resetTranscript();
            setMessages([
              {
                message: "Hello, I'm ChatGPT! Ask me anything!",
                sentTime: "just now",
                sender: "ChatGPT",
              },
            ]);
          }}
        >
          Reset
        </button>
        <button
          className={cnDictaphone("Button")}
          onClick={() => setVisibleText(!visibleText)}
        >
          {visibleText ? "Hide text" : "Show text"}
        </button>
      </div>
      {/* <p>{transcript}</p> */}
      {hints}
    </div>
  );
};

export default Dictaphone;
