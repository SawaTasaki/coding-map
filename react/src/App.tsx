import React, { useEffect, useRef, useState } from "react";
import japanMap from "./assets/日本地図.png";

type LatLng = { latitude: number; longitude: number };

// 画像が表現している範囲（例：日本全域ざっくり）
const JAPAN_BOUNDS = {
  minLat: 25.0,  // 南端（沖縄あたり）
  maxLat: 46.0,  // 北端（北海道あたり）
  minLon: 122.0, // 西端
  maxLon: 150.0, // 東端
};

function latLngToXY(
  lat: number,
  lon: number,
  width: number,
  height: number,
  bounds = JAPAN_BOUNDS
) {
  // x: 左→右に増加、y: 上→下に増加（CSS座標）
  const xNorm = (lon - bounds.minLon) / (bounds.maxLon - bounds.minLon);
  const yNorm = (bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat);
  return {
    x: xNorm * width,
    y: yNorm * height,
  };
}

export default function JapanStaticMap({}: {}) {
  const [points, setPoints] = useState<LatLng[]>([]);
  const [scheduledEndAt, setScheduledEndAt] = useState<string>("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // 位置データ取得
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:8000/locations/latlng");
      const data: LatLng[] = await res.json();
      setPoints(data);
    })();
  }, []);

  // 画像サイズの追従（レスポンシブ）
  useEffect(() => {
    const updateSize = () => {
      const el = imgRef.current;
      if (!el) return;
      setSize({ w: el.clientWidth, h: el.clientHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleLog = async () => {
    if (!scheduledEndAt) {
      alert("終了予定時刻を入力してください。");
      return;
    }
    if (!("geolocation" in navigator)) {
      alert("このブラウザは位置情報取得に対応していません。");
      return;
    }

    // 入力されたローカル時刻をUTCに正規化（DB送信用など）
    const scheduledIsoUtc = new Date(scheduledEndAt).toISOString();

    // geolocation を Promise で扱う
    const getPosition = (options?: PositionOptions) =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

    try {
      const pos = await getPosition({
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 0,
      });
      const { latitude, longitude, accuracy, altitude, heading, speed } = pos.coords;
      const capturedAtIsoUtc = new Date(pos.timestamp).toISOString();

      console.log("scheduled_end_at (local):", scheduledEndAt);       // 例: 2025-08-17T12:00
      console.log("scheduled_end_at (ISO UTC):", scheduledIsoUtc);   // 例: 2025-08-17T03:00:00.000Z
      console.log("browser location:", {
        latitude,
        longitude,
        accuracy,       // m
        altitude,       // null のこと多い
        heading,        // null のこと多い
        speed,          // null のこと多い
        captured_at_utc: capturedAtIsoUtc,
      });

      // もし画面にも現在地マーカーを出したいなら、ここで state に入れて再描画すればOK
      // setPoints([{ latitude, longitude }]); など
    } catch (err: any) {
      const code = err?.code;
      const msg =
        code === 1 ? "位置情報の許可が必要です（Permission denied）。" :
        code === 2 ? "位置情報を取得できません（Position unavailable）。" :
        code === 3 ? "位置情報の取得がタイムアウトしました。" :
        "位置情報の取得で不明なエラーが発生しました。";
      console.error(err);
      alert(msg);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 800, // 好きな表示サイズ
        margin: "0 auto",
      }}
    >

      {/* 右上のフォームパネル */}
      <div
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          zIndex: 10,
          background: "rgba(255,255,255,0.95)",
          padding: 12,
          borderRadius: 8,
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <label style={{ fontSize: 12 }}>
          終了予定時刻
          <input
            type="datetime-local"
            value={scheduledEndAt}
            onChange={(e) => setScheduledEndAt(e.target.value)}
            style={{ marginLeft: 6 }}
          />
        </label>
        <button
          onClick={handleLog}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
        >
          コンソール出力
        </button>
      </div>

      <img
        ref={imgRef}
        src={japanMap}
        alt="Japan blank map"
        style={{ width: "100%", height: "auto", display: "block" }}
        onLoad={() => {
          const el = imgRef.current;
          if (el) setSize({ w: el.clientWidth, h: el.clientHeight });
        }}
      />
      {/* マーカー群 */}
      {size.w > 0 &&
        points.map((p, i) => {
          const { x, y } = latLngToXY(p.latitude, p.longitude, size.w, size.h);
          // 範囲外はスキップ
          if (x < 0 || x > size.w || y < 0 || y > size.h) return null;
          return (
            <div
              key={i}
              title={`${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                width: 10,
                height: 10,
                borderRadius: "9999px",
                background: "crimson",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.9)",
                cursor: "pointer",
              }}
            />
          );
        })}
    </div>
  );
}
