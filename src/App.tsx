import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCcw,
  Gift,
  PartyPopper,
  QrCode,
  X,
} from "lucide-react";

// TypeScript用の型定義
interface Fortune {
  id: number;
  rank: string;
  discount: string;
  desc: string;
  color: string;
  borderColor: string;
  bgPattern: string;
  weight: number;
}

export default function SpaOmikuji() {
  const [gameState, setGameState] = useState<string>("start");
  const [result, setResult] = useState<Fortune | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  // 【重要】デザインが崩れるのを防ぐ自動修復機能
  useEffect(() => {
    // URLの取得（念のため遅延させて確実に取得）
    const timer = setTimeout(() => {
      setCurrentUrl(window.location.href);
    }, 500);

    // Tailwind CSSの読み込みチェックと注入
    if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
    return () => clearTimeout(timer);
  }, []);

  // おみくじの設定（確率：大大吉5%, 大吉15%, 中吉80%）
  const fortunes: Fortune[] = [
    {
      id: 1,
      rank: "大大吉",
      discount: "1,000円 OFF",
      desc: "心も体も絶好調。\n挑戦も出会いもすべてが追い風。\nOLIVE SPAで癒されれば、運気は最高潮。",
      color: "text-yellow-600",
      borderColor: "border-yellow-500",
      bgPattern: "bg-yellow-50",
      weight: 5,
    },
    {
      id: 2,
      rank: "大吉",
      discount: "500円 OFF",
      desc: "良い流れに乗れる一年。\n新しい挑戦やご縁に恵まれそう。\nOLIVE SPAで運気をさらに底上げ。",
      color: "text-red-600",
      borderColor: "border-red-600",
      bgPattern: "bg-red-50",
      weight: 15,
    },
    {
      id: 3,
      rank: "中吉",
      discount: "お年賀お菓子",
      desc: "穏やかで安定した一年。\n無理せず整えることが開運のカギ。\nOLIVE SPAで心身をリセット。",
      color: "text-pink-600",
      borderColor: "border-pink-500",
      bgPattern: "bg-pink-50",
      weight: 80,
    },
  ];

  const drawFortune = (): Fortune => {
    const totalWeight = fortunes.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const fortune of fortunes) {
      if (random < fortune.weight) {
        return fortune;
      }
      random -= fortune.weight;
    }
    return fortunes[fortunes.length - 1];
  };

  const handleDraw = () => {
    setGameState("shaking");
    setTimeout(() => {
      const drawn = drawFortune();
      setResult(drawn);
      setGameState("result");
      if (drawn.rank === "大大吉" || drawn.rank === "大吉") {
        setShowConfetti(true);
      }
    }, 2500);
  };

  const resetGame = () => {
    setGameState("start");
    setResult(null);
    setShowConfetti(false);
  };

  const Snowflakes = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-60 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800 relative overflow-hidden flex flex-col items-center justify-center">
      <style>{`
        @keyframes shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(5deg) translateY(-5px); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-5deg) translateY(5px); }
          100% { transform: rotate(0deg); }
        }
        @keyframes fall {
          0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(20px); opacity: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
        .animate-popIn {
          animation: popIn 0.5s ease-out forwards;
        }
        .bg-pattern {
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      <div className="absolute inset-0 bg-pattern z-0 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 z-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 z-50"></div>

      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowQrModal(true)}
          className="bg-stone-800 text-white p-3 rounded-full shadow-lg hover:bg-stone-700 transition-colors flex items-center gap-2 pr-4"
          title="スマホ読み取り用QRコードを表示"
        >
          <QrCode className="w-5 h-5" />
          <span className="text-xs font-bold">QR</span>
        </button>
      </div>

      {showQrModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-popIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full relative flex flex-col items-center text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold text-stone-800 mb-2">
              スマホで運試し
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              お手持ちのスマートフォンで
              <br />
              以下のQRコードを読み取ってください。
            </p>
            <div className="p-4 bg-white border-2 border-red-100 rounded-xl mb-4 flex flex-col justify-center items-center min-h-[200px]">
              {currentUrl ? (
                <>
                  <img
                    src={`https://quickchart.io/qr?text=${encodeURIComponent(
                      currentUrl
                    )}&size=200&margin=2&ecLevel=M&light=ffffff`}
                    alt="Page QR Code"
                    className="w-48 h-48 mb-2"
                  />
                  <p className="text-[10px] text-stone-400 break-all max-w-[200px] leading-tight text-center">
                    接続先: {currentUrl}
                  </p>
                </>
              ) : (
                <div className="text-stone-400 text-sm">URL取得中...</div>
              )}
            </div>
            <p className="text-xs text-stone-400">
              ※URLが正しいかご確認ください
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md px-6 py-8 flex flex-col items-center min-h-[600px] justify-center">
        <div className="mb-8 text-center w-full">
          <div className="inline-block px-4 py-1 mb-4 border border-red-500 text-red-600 rounded-full text-sm tracking-widest bg-white/80">
            謹賀新年
          </div>

          <div className="mb-4 flex justify-center h-20 items-center">
            {!imageError ? (
              <img
                src="オリーブスパrogo.png"
                alt="OLIVE SPA"
                className="h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-serif font-bold tracking-widest text-stone-900">
                  OLIVE SPA
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-stone-500 mt-1">
                  Aroma & Asian Healing
                </span>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-red-600 tracking-wider mb-2">
            新春運試し
          </h1>
          <p className="text-stone-500 text-sm">素敵な一年になりますように</p>
        </div>

        {gameState === "start" && (
          <div className="flex flex-col items-center animate-popIn w-full">
            <div className="w-48 h-64 bg-red-600 rounded-lg shadow-xl relative flex items-center justify-center border-4 border-yellow-500 mb-8">
              <div className="absolute inset-2 border border-red-400 rounded"></div>
              <div className="text-white text-5xl font-serif writing-vertical-rl tracking-widest">
                御神籤
              </div>
              <div className="absolute -top-4 w-32 h-8 bg-stone-800 rounded-full shadow-md border-b-4 border-yellow-600"></div>
            </div>

            <button
              onClick={handleDraw}
              className="w-full max-w-xs bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition active:scale-95 hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              おみくじを引く
            </button>
            {/* 文言を削除しました */}
          </div>
        )}

        {gameState === "shaking" && (
          <div className="flex flex-col items-center w-full">
            <div className="w-48 h-64 bg-red-600 rounded-lg shadow-xl relative flex items-center justify-center border-4 border-yellow-500 mb-8 animate-shake">
              <div className="absolute inset-2 border border-red-400 rounded"></div>
              <div className="text-white text-5xl font-serif writing-vertical-rl tracking-widest">
                祈願
              </div>
              <div className="absolute -top-4 w-32 h-8 bg-stone-800 rounded-full shadow-md border-b-4 border-yellow-600"></div>
            </div>
            <p className="text-stone-600 font-bold animate-pulse text-lg">
              念を込めて...
            </p>
          </div>
        )}

        {gameState === "result" && result && (
          <div className="w-full flex flex-col items-center animate-popIn relative">
            {showConfetti && (
              <div className="absolute -top-20 inset-x-0 flex justify-center pointer-events-none">
                <PartyPopper className="w-12 h-12 text-yellow-500 animate-bounce" />
              </div>
            )}

            <div
              className={`w-full bg-white rounded-lg shadow-2xl overflow-hidden border-2 ${result.borderColor} mb-6`}
            >
              <div
                className={`${result.bgPattern} p-6 flex flex-col items-center text-center border-b border-dashed border-stone-300`}
              >
                <div className="mb-2 text-stone-500 text-sm tracking-widest">
                  あなたの運勢
                </div>
                <div
                  className={`text-6xl font-bold font-serif mb-4 ${result.color} drop-shadow-sm`}
                >
                  {result.rank}
                </div>
                <div className="w-16 h-1 bg-stone-200 mb-4 rounded-full"></div>
                <p className="text-stone-600 text-sm whitespace-pre-wrap leading-relaxed">
                  {result.desc}
                </p>
              </div>

              <div className="bg-stone-50 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <Gift className="absolute text-stone-200 w-32 h-32 -right-8 -bottom-8 opacity-50" />

                <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-1">
                  Special Gift
                </p>
                {/* 文字数によってサイズを調整 */}
                <div
                  className={`${
                    result.discount.length > 8 ? "text-2xl" : "text-4xl"
                  } font-extrabold ${result.color} mb-2`}
                >
                  {result.discount}
                </div>
                <p className="text-xs text-stone-400 bg-white px-3 py-1 rounded border border-stone-200 z-10">
                  お会計時にスタッフへご提示ください
                </p>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="mt-2 text-stone-500 hover:text-stone-800 underline underline-offset-4 flex items-center gap-2 text-sm transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              もう一度引く
            </button>
          </div>
        )}
      </div>
      <Snowflakes />
    </div>
  );
}
