//  用途 : 計算 loading 狀態下經過的秒數，用來顯示使用者等待時間
//  功能 : 
//  當 loading 為 true 時，每秒遞增一次計時器
//  當 loading 為 false 或元件卸載時，自動停止計時
import { useEffect, useState } from "react";
export const useLoadingTimer = (key) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!key) return;

    setSeconds(0);
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [key]);

  return seconds;
}
