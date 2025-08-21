import { useEffect, useState } from "react";
import "./App.css";

function usePing(url: string) {
  const [msg, setMsg] = useState("…");
  useEffect(() => {
    if (!url) return;
    fetch(url)
      .then((r) => r.text())
      .then(setMsg)
      .catch(() => setMsg("error"));
  }, [url]);
  return msg;
}

export default function App() {
  const auth = usePing(`${import.meta.env.VITE_API_AUTH}/api/v1/auth/ping`);
  const resume = usePing(`${import.meta.env.VITE_API_RESUME}/api/v1/resumes/ping`);
  const job = usePing(`${import.meta.env.VITE_API_JOB}/api/v1/jobs/ping`);

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">JobMatcher Frontend</h1>
      <div>Auth: {auth}</div>
      <div>Resume: {resume}</div>
      <div>Job: {job}</div>
    </div>
  );
}

