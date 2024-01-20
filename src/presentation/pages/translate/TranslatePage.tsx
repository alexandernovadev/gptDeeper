import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
} from "../../components";
import { translateUseCase } from "../../../core/use-cases/translateUseCase";

interface Message {
  text: string;
  isGpt: boolean;
}

export interface Option {
  id: string;
  text: string;
}
const options: Option[] = [
  { id: "Spanish", text: "Spanish" },
  { id: "English", text: "English" },
  { id: "Portugues", text: "Portugues" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, lang = 'english') => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { ok, content } = await translateUseCase(text, lang);

    if (!ok) return;

    setMessages((prev) => [...prev, { text: content!, isGpt: true }]);

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, I'm a experta translator, what do you need translate ?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBoxSelect
        onSendMessage={(textuser, languser) => handlePost(textuser, languser)}
        placeholder="Select Language"
        options={options}
        disableCorrections
      />
    </div>
  );
};
