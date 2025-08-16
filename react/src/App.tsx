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

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 800, // 好きな表示サイズ
        margin: "0 auto",
      }}
    >
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
