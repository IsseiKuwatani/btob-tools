"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IconChevronRight, IconLightning, IconArrowRight, IconCheck } from "@/components/icons";

interface Message {
  id: number;
  type: "bot" | "user";
  content: string;
  options?: string[];
}

const questions = [
  {
    id: 1,
    content: "こんにちは！👋 お問い合わせありがとうございます。まず、お名前を教えていただけますか？",
    field: "name",
    type: "text",
  },
  {
    id: 2,
    content: "ありがとうございます、{name}さん！会社名を教えてください。",
    field: "company",
    type: "text",
  },
  {
    id: 3,
    content: "ありがとうございます！どのようなお悩みがありますか？",
    field: "concern",
    type: "options",
    options: ["リード獲得を増やしたい", "CVRを改善したい", "営業効率を上げたい", "その他"],
  },
  {
    id: 4,
    content: "なるほど、{concern}のお悩みですね。現在の月間リード数はどのくらいですか？",
    field: "leads",
    type: "options",
    options: ["〜50件", "50〜100件", "100〜300件", "300件以上"],
  },
  {
    id: 5,
    content: "最後に、メールアドレスを教えていただけますか？担当者からご連絡いたします。",
    field: "email",
    type: "email",
  },
];

export default function ChatFormPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 初回メッセージを表示
    if (messages.length === 0) {
      addBotMessage(questions[0].content);
    }
  }, []);

  const addBotMessage = (content: string, options?: string[]) => {
    setIsTyping(true);
    
    // タイピング演出
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "bot",
        content: replaceVariables(content),
        options,
      }]);
      
      // 入力フィールドにフォーカス
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, 800);
  };

  const replaceVariables = (text: string): string => {
    let result = text;
    Object.entries(formData).forEach(([key, value]) => {
      result = result.replace(`{${key}}`, value);
    });
    return result;
  };

  const handleSubmit = (value: string) => {
    if (!value.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // ユーザーの回答を追加
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: "user",
      content: value,
    }]);

    // フォームデータを更新
    const newFormData = { ...formData, [currentQuestion.field]: value };
    setFormData(newFormData);
    setInputValue("");

    // 次の質問へ
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      
      setTimeout(() => {
        let content = nextQuestion.content;
        Object.entries(newFormData).forEach(([key, val]) => {
          content = content.replace(`{${key}}`, val);
        });
        addBotMessage(content, nextQuestion.options);
      }, 300);
    } else {
      // 完了
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setIsComplete(true);
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: "bot",
            content: `${newFormData.name}さん、ありがとうございました！✨\n\n入力いただいた内容をもとに、担当者から1営業日以内にご連絡いたします。\n\nお問い合わせいただきありがとうございました！`,
          }]);
        }, 800);
      }, 300);
    }
  };

  const handleOptionClick = (option: string) => {
    handleSubmit(option);
  };

  const resetDemo = () => {
    setMessages([]);
    setCurrentQuestionIndex(0);
    setInputValue("");
    setFormData({});
    setIsComplete(false);
    
    setTimeout(() => {
      addBotMessage(questions[0].content);
    }, 100);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background-secondary py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
          <IconChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-foreground transition-colors">ツール一覧</Link>
          <IconChevronRight className="w-4 h-4" />
          <span className="text-foreground">チャット形式フォーム</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-primary font-medium bg-primary-light px-2 py-1 rounded">
                デモ
              </span>
              <h1 className="text-2xl font-bold text-foreground mt-2">
                チャット形式フォーム
              </h1>
              <p className="text-foreground-muted mt-1">
                対話形式で情報を収集。フォームっぽくないUIで入力完了率アップ。
              </p>
            </div>
            <button
              onClick={resetDemo}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-background-secondary transition-colors"
            >
              リセット
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-lg">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">お問い合わせチャット</p>
              <p className="text-xs text-blue-100">通常1営業日以内に返信</p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-primary text-white rounded-2xl rounded-br-md"
                      : "bg-white text-foreground rounded-2xl rounded-bl-md shadow-sm border border-border"
                  } px-4 py-3`}
                >
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                  
                  {/* Options */}
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left px-3 py-2 bg-background-secondary hover:bg-primary-light text-foreground text-sm rounded-lg transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-border px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!isComplete && currentQuestion?.type !== "options" && (
            <div className="p-4 bg-white border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(inputValue);
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type={currentQuestion?.type === "email" ? "email" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    currentQuestion?.type === "email" 
                      ? "example@company.com" 
                      : "入力してください..."
                  }
                  className="flex-1 px-4 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <IconArrowRight className="w-5 h-5" />
                </button>
              </form>
              <p className="text-xs text-foreground-muted text-center mt-2">
                ※ デモ用です。実際には送信されません。
              </p>
            </div>
          )}

          {/* Complete */}
          {isComplete && (
            <div className="p-4 bg-green-50 border-t border-green-100 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <IconCheck className="w-5 h-5" />
                <span className="font-medium">お問い合わせ完了</span>
              </div>
            </div>
          )}
        </div>

        {/* Collected Data Preview */}
        {Object.keys(formData).length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">収集したデータ</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="p-3 bg-background-secondary rounded-lg">
                  <p className="text-xs text-foreground-muted mb-1">
                    {key === "name" && "お名前"}
                    {key === "company" && "会社名"}
                    {key === "concern" && "お悩み"}
                    {key === "leads" && "月間リード数"}
                    {key === "email" && "メールアドレス"}
                  </p>
                  <p className="font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Section */}
        <div className="mt-10 p-6 bg-white rounded-xl border border-border">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <IconLightning className="w-5 h-5 text-primary" />
            このツールをCursorで作るには？
          </h3>
          <p className="text-sm text-foreground-muted mb-4">
            以下のようなプロンプトをCursorのComposer (Command + I) に入力するだけで、このようなツールが作れます。
          </p>
          <div className="bg-foreground text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <code>
              チャット形式のリード獲得フォームを作ってください。
              ボットが質問を1つずつ表示し、ユーザーが回答していく対話形式にします。
              名前→会社名→お悩み（選択式）→メールアドレスの順で聞いてください。
              タイピング中のアニメーションも表示してください。
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

