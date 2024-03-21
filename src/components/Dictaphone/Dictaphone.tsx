// @ts-nocheck
"use client";

import React, { useState } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "";

const template = (
  text: string,
  speech: string
) => `Мне нужно, чтобы ты выступил в роли докладчика на конференции перед большой аудиторией. Представь, что у тебя есть подготовленный текст:
${text}
Ты уже успел сказать вот это: 
${speech}
Предложи три мысли, которые можно сказать дальше, так, чтобы текст был логически связан, а также мы бы не упустили ничего важного. Обязательно опирайся на подготовленный текст! Также каждое предложение по длине должно быть не больше, чем 20 слов! Используй более фольмальный стиль!`;

const Dictaphone = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState<string>("");

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
    <div>
      <textarea
        value={text}
        onInput={(t) => {
          setText(t.target.value);
        }}
        rows={20}
        cols={100}
      />
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button
        onClick={() => SpeechRecognition.startListening({ continuous: true })}
      >
        Start
      </button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <button onClick={() => handleSendRequest(transcript)}>ChatGPT</button>
      <p>{transcript}</p>
      {isTyping ? (
        <p>...</p>
      ) : (
        messages
          .slice(1)
          .map(({ message, sender }, index) =>
            sender === "user" ? null : <p key={index}>{message}</p>
          )
      )}
    </div>
  );
};

export default Dictaphone;
