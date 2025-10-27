import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Sparkles,
  Shuffle,
  RefreshCw,
  Copy,
  Info,
  Moon,
  SunMedium,
  HeartHandshake,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * Tarot 3-Card Reading App UI
 * — 溫暖、理性、啟發式語氣
 * — 自動抽三張：「過去 / 現在 / 未來」
 * — 報告結構：🎯 一句話總結｜🃏 牌面解讀｜💡 行動建議（3項）｜⚠️ 風險提醒
 * — 不做宿命式預言；強調「塔羅反映當下傾向，選擇與行動在你手上」。
 * — 使用 Tailwind + shadcn/ui + framer-motion。單檔可直接在 Next.js/React 專案中使用。
 */

// 簡化版塔羅資料（僅示例，可自行擴充）
const TAROT_DECK = [
  {
    id: 0,
    name: "愚者 The Fool",
    arcana: "0",
    upright: ["起點", "純真", "勇於嘗試"],
    reversed: ["衝動", "逃避責任", "方向不明"],
    meaning:
      "在心理象徵上，愚者像初學者心態，提醒以好奇心面對未知，同時留意界線與風險。",
  },
  {
    id: 1,
    name: "魔術師 The Magician",
    arcana: "I",
    upright: ["專注", "資源整合", "行動力"],
    reversed: ["分心", "操弄", "資源未善用"],
    meaning:
      "魔術師象徵意志與溝通，把想法變行動。聚焦一件事，力量會像光束一樣集中。",
  },
  {
    id: 2,
    name: "女祭司 The High Priestess",
    arcana: "II",
    upright: ["直覺", "內在智慧", "覺察"],
    reversed: ["壓抑情緒", "自我懷疑", "訊息不清"],
    meaning:
      "女祭司象徵靜心與內在訊息。先聽見自己的聲音，再決定外在的步伐。",
  },
  {
    id: 3,
    name: "女皇 The Empress",
    arcana: "III",
    upright: ["滋養", "豐盛", "創造力"],
    reversed: ["過度付出", "慣性消耗", "界線模糊"],
    meaning: "女皇像大地之母：補給自己，才有能量照顧他人與專案。",
  },
  {
    id: 4,
    name: "皇帝 The Emperor",
    arcana: "IV",
    upright: ["結構", "規劃", "責任"],
    reversed: ["僵化", "控制", "權力拉扯"],
    meaning:
      "皇帝象徵秩序與邊界。好的框架讓創意更安全地落地。",
  },
  {
    id: 5,
    name: "教皇 The Hierophant",
    arcana: "V",
    upright: ["價值觀", "傳承", "學習"],
    reversed: ["守舊", "盲從", "形式大於本質"],
    meaning:
      "教皇提醒回到價值觀：為何而做？把意義釐清，決策會更穩健。",
  },
  {
    id: 6,
    name: "戀人 The Lovers",
    arcana: "VI",
    upright: ["連結", "選擇", "一致性"],
    reversed: ["猶豫", "分岐", "價值衝突"],
    meaning:
      "戀人象徵關係與選擇。當內外一致，路會更順。",
  },
  {
    id: 7,
    name: "戰車 The Chariot",
    arcana: "VII",
    upright: ["決斷", "推進", "界線感"],
    reversed: ["分心", "節奏失衡", "方向拉扯"],
    meaning:
      "戰車是目標導向與自我掌舵。先定路線，再加速。",
  },
  {
    id: 8,
    name: "力量 Strength",
    arcana: "VIII",
    upright: ["溫柔的力量", "自我調節", "勇氣"],
    reversed: ["自我苛責", "壓抑", "能量消耗"],
    meaning:
      "力量不是硬碰硬，而是穩住呼吸後的溫柔堅定。",
  },
  {
    id: 9,
    name: "隱者 The Hermit",
    arcana: "IX",
    upright: ["內省", "釐清", "慢下來"],
    reversed: ["孤立", "逃避互動", "燈太暗"],
    meaning:
      "隱者提醒留白與反思，在安靜處把問題看清楚。",
  },
  {
    id: 10,
    name: "命運之輪 Wheel of Fortune",
    arcana: "X",
    upright: ["循環轉動", "機會", "節點"],
    reversed: ["延宕", "抗拒變化", "重複模式"],
    meaning:
      "命運之輪象徵週期。看見模式，就能做出不同選擇。",
  },
  {
    id: 11,
    name: "正義 Justice",
    arcana: "XI",
    upright: ["公正", "對齊事實", "取捨"],
    reversed: ["偏頗", "資訊不全", "欠缺界線"],
    meaning:
      "正義要求對事實坦誠，讓決策建立在清楚的資料上。",
  },
  {
    id: 12,
    name: "吊人 The Hanged Man",
    arcana: "XII",
    upright: ["換角度", "暫停", "臣服"],
    reversed: ["卡住", "過度等待", "自我犧牲"],
    meaning:
      "吊人是視角訓練。暫停不是退縮，而是為了看見新的路。",
  },
  {
    id: 13,
    name: "死神 Death",
    arcana: "XIII",
    upright: ["結束與更新", "放下", "轉化"],
    reversed: ["抗拒改變", "留戀舊制", "遷延不決"],
    meaning:
      "死神象徵舊階段收尾與新篇章開啟。空出空間，新的才進得來。",
  },
  {
    id: 14,
    name: "節制 Temperance",
    arcana: "XIV",
    upright: ["調和", "節奏", "漸進"],
    reversed: ["過猶不及", "步調失衡", "配方不對"],
    meaning:
      "節制像調配配方：比例對了，一切就順了。",
  },
  {
    id: 15,
    name: "惡魔 The Devil",
    arcana: "XV",
    upright: ["依賴", "慣性束縛", "慾望議題"],
    reversed: ["鬆綁", "自覺", "界線重建"],
    meaning:
      "惡魔指向慣性與成癮回路。覺察就有自由度。",
  },
  {
    id: 16,
    name: "高塔 The Tower",
    arcana: "XVI",
    upright: ["突變", "舊制瓦解", "覺醒"],
    reversed: ["低度震盪", "延後調整", "安全降落"],
    meaning:
      "高塔是系統更新。拆掉不穩的部分，才能蓋起更牢的結構。",
  },
  {
    id: 17,
    name: "星星 The Star",
    arcana: "XVII",
    upright: ["希望", "修復", "長線願景"],
    reversed: ["失望", "信心不足", "暫時看不見"],
    meaning:
      "星星像長夜中的微光，提醒我們把眼光放遠，慢慢修復。",
  },
  {
    id: 18,
    name: "月亮 The Moon",
    arcana: "XVIII",
    upright: ["潛意識", "模糊地帶", "情緒波動"],
    reversed: ["釐清", "夢醒", "怕黑的部分被看見"],
    meaning:
      "月亮談的是不確定感。用好奇而非批判去探索未知。",
  },
  {
    id: 19,
    name: "太陽 The Sun",
    arcana: "XIX",
    upright: ["清晰", "活力", "信任生命"],
    reversed: ["過度樂觀", "能量耗損", "假性正向"],
    meaning:
      "太陽帶來明朗與能量回充。把簡單與喜悅安排回日程。",
  },
  {
    id: 20,
    name: "審判 Judgement",
    arcana: "XX",
    upright: ["覺醒", "召喚", "回應內在號角"],
    reversed: ["猶豫", "害怕被看見", "延遲重啟"],
    meaning:
      "審判是喚醒。當訊號明顯，給自己一個回應。",
  },
  {
    id: 21,
    name: "世界 The World",
    arcana: "XXI",
    upright: ["整合", "完成", "更大視野"],
    reversed: ["未竟之事", "循環未完", "邊界待整合"],
    meaning:
      "世界象徵整體性。完成不是句點，而是新旅程的門。",
  },
];

const POSITIONS = [
  { key: "past", label: "過去", icon: <Bookmark className="h-4 w-4" /> },
  { key: "present", label: "現在", icon: <HeartHandshake className="h-4 w-4" /> },
  { key: "future", label: "未來", icon: <Sparkles className="h-4 w-4" /> },
] as const;

type DrawnCard = {
  position: (typeof POSITIONS)[number]["key"];
  card: (typeof TAROT_DECK)[number];
  isReversed: boolean;
};

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function drawThree(): DrawnCard[] {
  const picked: number[] = [];
  const result: DrawnCard[] = [];
  POSITIONS.forEach((pos) => {
    let idx = randomInt(TAROT_DECK.length);
    // 確保不重複
    while (picked.includes(idx)) idx = randomInt(TAROT_DECK.length);
    picked.push(idx);
    result.push({ position: pos.key, card: TAROT_DECK[idx], isReversed: Math.random() < 0.48 });
  });
  return result;
}

function orientationText(isReversed: boolean) {
  return isReversed ? "逆位" : "正位";
}

function keywords(card: (typeof TAROT_DECK)[number], isReversed: boolean) {
  return isReversed ? card.reversed : card.upright;
}

function buildSummary(d: DrawnCard[], question: string) {
  // 溫和的一句話總結（非預言）
  const now = d.find((x) => x.position === "present");
  const k = now ? keywords(now.card, now.isReversed)[0] : "釐清";
  const topic = question?.trim() ? `針對「${question.trim()}」` : "針對你的提問";
  return `${topic}，目前的關鍵在「${k}」。放慢一步看清方向，讓下一步更到位。`;
}

function adviceFromCard(dc: DrawnCard) {
  const n = dc.card.name;
  const ks = keywords(dc.card, dc.isReversed);
  switch (dc.card.id) {
    case 1: // 魔術師
      return `把一件小事做到位（${n}：${ks[0]}），先做 1 個可驗證的小行動。`;
    case 7: // 戰車
      return `先定界線與節奏（${n}：${ks[0]}），用番茄鐘或時間盒管理推進。`;
    case 14: // 節制
      return `調整比例（${n}：${ks[0]}），把 1～2 項關鍵元素做微調再觀察。`;
    case 17: // 星星
      return `寫下 90 天長線願景（${n}：${ks[0]}），每天 10 分鐘微行動。`;
    case 11: // 正義
      return `列事實 vs. 解讀（${n}：${ks[0]}），把決策建立在可驗證資料上。`;
    default:
      return `以「${n}」的訊息（${ks.join("／")}）為線索，選 1 件最小可行步驟先行動。`;
  }
}

function riskFromSpread(d: DrawnCard[]) {
  // 依卡牌能量給一個溫和風險提醒
  if (d.some((x) => [15, 18].includes(x.card.id))) {
    return "情緒與慣性可能放大決策偏誤。先睡一覺或換個時間點再檢視。";
  }
  if (d.some((x) => x.card.id === 16)) {
    return "結構性調整在路上，先備案與緩衝時間，讓變動更安全。";
  }
  if (d.some((x) => x.card.id === 12)) {
    return "過久的停滯會消耗心力。設定一個『最晚決定日』，幫助你向前。";
  }
  return "過度追求完美可能延遲行動。允許 80 分先出發，再用迭代優化。";
}

function CardFront({ name, arcana }: { name: string; arcana: string }) {
  return (
    <div className="aspect-[2/3] w-full rounded-2xl border bg-gradient-to-br from-white/90 to-white p-4 shadow-sm flex flex-col items-center justify-between">
      <div className="text-xs opacity-60">Major Arcana</div>
      <div className="text-center">
        <div className="text-4xl font-semibold tracking-wide">{arcana}</div>
        <div className="mt-2 text-sm font-medium text-gray-600">{name}</div>
      </div>
      <div className="text-[10px] opacity-50">tarot · three-card</div>
    </div>
  );
}

function CardBack() {
  return (
    <div className="aspect-[2/3] w-full rounded-2xl border bg-gradient-to-br from-slate-100 to-slate-200 p-4 shadow-inner flex items-center justify-center">
      <Shuffle className="h-8 w-8 opacity-30" />
    </div>
  );
}

export default function TarotThreeCardApp() {
  const [question, setQuestion] = useState("");
  const [drawn, setDrawn] = useState<DrawnCard[] | null>(null);
  const [themeDark, setThemeDark] = useState(false);

  const summary = useMemo(() => (drawn ? buildSummary(drawn, question) : ""), [drawn, question]);

  const handleDraw = () => {
    const d = drawThree();
    setDrawn(d);
  };

  const handleReset = () => {
    setDrawn(null);
  };

  const handleCopy = async () => {
    if (!drawn) return;
    const lines: string[] = [];
    lines.push(`🎯 一句話總結\n${summary}`);
    lines.push("\n🃏 牌面解讀");
    drawn.forEach((dc) => {
      const pos = POSITIONS.find((p) => p.key === dc.position)?.label;
      const ks = keywords(dc.card, dc.isReversed).join("／");
      lines.push(`• ${pos}｜${dc.card.name}（${orientationText(dc.isReversed)}）：${dc.card.meaning}｜關聯重點：${ks}`);
    });
    lines.push("\n💡 行動建議");
    const adv = drawn.slice(0, 3).map((dc) => `• ${adviceFromCard(dc)}`);
    lines.push(...adv);
    lines.push("\n⚠️ 風險提醒\n• " + riskFromSpread(drawn));
    lines.push("\n（溫柔提醒：塔羅反映的是當下傾向；選擇與行動仍由你決定。）");
    await navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <div
      className={
        "min-h-screen w-full " +
        (themeDark ? "bg-slate-900 text-slate-100" : "bg-gradient-to-b from-amber-50 to-white text-slate-900")
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10"
            >
              <Sparkles className="h-5 w-5 text-amber-600" />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold leading-tight">三張牌塔羅顧問</h1>
              <p className="text-sm opacity-70">溫暖 × 理性 × 啟發式｜以心理象徵理解當下的能量流向</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={themeDark ? "secondary" : "outline"} size="sm" onClick={() => setThemeDark(!themeDark)}>
              {themeDark ? <SunMedium className="h-4 w-4 mr-1" /> : <Moon className="h-4 w-4 mr-1" />}切換主題
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!drawn}>
              <Copy className="h-4 w-4 mr-1" /> 複製解讀
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Query Panel */}
        <Card className={themeDark ? "bg-slate-800/60" : "bg-white/70 backdrop-blur"}>
          <CardHeader>
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />輸入你的提問（可聚焦於一個主題）
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[88px]"
              placeholder="例：我想了解轉換工作跑道在未來三個月的發展方向。"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleDraw} className="gap-2">
                <Shuffle className="h-4 w-4" /> 抽出三張牌
              </Button>
              <Button variant="ghost" onClick={handleReset} className="gap-2" disabled={!drawn}>
                <RefreshCw className="h-4 w-4" /> 重置
              </Button>
              <div className="text-xs opacity-70">抽牌即代表：我以開放且善意的心態面對自我探索。</div>
            </div>
          </CardContent>
        </Card>

        {/* Spread */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-6">
            <Card className={themeDark ? "bg-slate-800/60" : "bg-white/70 backdrop-blur"}>
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Shuffle className="h-4 w-4" /> 三張牌陣
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {POSITIONS.map((pos, i) => (
                    <div key={pos.key} className="space-y-2">
                      <div className="flex items-center gap-1 text-xs opacity-70">
                        {pos.icon}
                        <span>{pos.label}</span>
                      </div>
                      <AnimatePresence mode="wait">
                        {drawn ? (
                          <motion.div
                            key={drawn[i].card.id + String(drawn[i].isReversed)}
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-full"
                          >
                            <motion.div style={{ rotate: drawn[i].isReversed ? 180 : 0 }} className="w-full">
                              <CardFront name={drawn[i].card.name} arcana={drawn[i].card.arcana} />
                            </motion.div>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <CardBack />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="text-xs text-center">
                        {drawn ? (
                          <Badge variant="secondary">{orientationText(drawn[i].isReversed)}</Badge>
                        ) : (
                          <span className="opacity-50">等待抽牌</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs opacity-70 text-center">
                  * 反轉表示「逆位」象徵：同一主題的另一面，提醒以更細緻的方式看待。
                </div>
              </CardContent>
            </Card>

            <Card className={themeDark ? "bg-slate-800/60" : "bg-white/70 backdrop-blur"}>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">🎯 一句話總結</CardTitle>
              </CardHeader>
              <CardContent>
                {drawn ? (
                  <p className="leading-relaxed">{summary}</p>
                ) : (
                  <p className="opacity-60">抽牌後將根據「現在牌」的能量，生成一段溫柔且務實的總結。</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-7 space-y-6">
            <Card className={themeDark ? "bg-slate-800/60" : "bg-white/70 backdrop-blur"}>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">🃏 牌面解讀</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {drawn ? (
                  POSITIONS.map((pos) => {
                    const dc = drawn.find((d) => d.position === pos.key)!;
                    const ks = keywords(dc.card, dc.isReversed);
                    return (
                      <div key={pos.key} className="rounded-xl border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm font-medium">
                            {pos.label}｜{dc.card.name}（{orientationText(dc.isReversed)}）
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {ks.map((t) => (
                              <Badge key={t} variant="outline" className="text-[11px]">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm opacity-80">{dc.card.meaning}</p>
                        <p className="mt-2 text-sm">
                          <span className="font-medium">與你的問題的關聯：</span>
                          {question?.trim() ? `在「${question.trim()}」上，` : "在你的主題上，"}
                          這張牌提醒你留意以上關鍵字，並以覺察與行動回應。
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm opacity-60">
                    抽牌後，這裡會依序呈現「過去、現在、未來」三張牌的心理象徵與情境詮釋。
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={themeDark ? "bg-slate-800/60" : "bg-white/70 backdrop-blur"}>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">💡 行動建議（3 項）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {drawn ? (
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    {drawn.slice(0, 3).map((dc, i) => (
                      <li key={i}>{adviceFromCard(dc)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm opacity-60">
                    抽牌後，系統會根據每張牌的能量，生成 3 條可立即採取的輕量步驟。
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className={themeDark ? "bg-slate-800/60" : "bg-white/70 backdrop-blur"}>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">⚠️ 風險提醒（盲點）</CardTitle>
              </CardHeader>
              <CardContent>
                {drawn ? (
                  <p className="text-sm">{riskFromSpread(drawn)}</p>
                ) : (
                  <p className="text-sm opacity-60">
                    抽牌後會給出一條溫和的風險提醒，幫助你在行動時更周全。
                  </p>
                )}
                <div className="mt-4 flex items-start gap-2 text-xs opacity-70">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p>
                    溫柔提醒：塔羅反映的是當下傾向與內在狀態，它提供的是參考地圖而非目的地保證。你的選擇與行動，才是改變走向的關鍵。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs opacity-70">
          <p>© {new Date().getFullYear()} 三張牌塔羅顧問 · 心理象徵 × 啟發式指引</p>
        </div>
      </div>
    </div>
  );
}

