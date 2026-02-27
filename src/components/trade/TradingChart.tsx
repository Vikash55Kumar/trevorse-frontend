import { useEffect, useRef } from "react";

interface Props {
  symbol: string;
}

export default function TradingChart({ symbol }: Props) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");

    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `${symbol}`, // IMPORTANT
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      hide_side_toolbar: false,
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="h-[300px] w-full">
      <div ref={container} className="h-full w-full" />
    </div>
  );
}