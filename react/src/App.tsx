import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    username: "",
    text: "",
  });
  const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN;

  // 投稿一覧を取得
  const fetchPosts = async () => {
    const res = await fetch(`${BACKEND_ORIGIN}/posts`);
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 投稿フォームの送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${BACKEND_ORIGIN}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    setForm({ title: "", username: "", text: "" }); // フォーム初期化
    fetchPosts(); // 再取得
  };

  // フォーム入力ハンドラ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>掲示板</h1>

      {/* 投稿フォーム */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="タイトル"
          required
          style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
        />
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="ユーザー名"
          required
          style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
        />
        <textarea
          name="text"
          value={form.text}
          onChange={handleChange}
          placeholder="本文"
          required
          rows={4}
          style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
        />
        <button type="submit">投稿する</button>
      </form>

      {/* 投稿一覧 */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            marginBottom: "1.5rem",
            borderBottom: "1px solid #ccc",
            paddingBottom: "1rem",
          }}
        >
          <h2>{post.title}</h2>
          <p>
            <strong>{post.username}</strong>
          </p>
          <p>{post.text}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
