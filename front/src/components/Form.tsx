"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { Button, Typography, Paper, List, ListItem } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Form = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    slide_count: number;
    pos_counts: { [key: string]: number };
    top_nouns: [string, number][];
    top_verbs: [string, number][];
    top_particles: [string, number][];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult(result);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // グラフデータの設定
  const data = {
    labels: uploadResult ? Object.keys(uploadResult.pos_counts) : [],
    datasets: [
      {
        label: "品詞ごとのカウント",
        data: uploadResult ? Object.values(uploadResult.pos_counts) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: "600px", margin: "auto", padding: 4, marginTop: 8 }}
    >
      <input
        type="file"
        accept=".pptx"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
        id="pptx-upload"
      />
      <label htmlFor="pptx-upload">
        <Button
          variant="outlined"
          component="span"
          sx={{
            padding: "10px 20px",
            borderColor: "#1976d2",
            color: "#1976d2",
          }}
        >
          PPTXファイルを選択
        </Button>
      </label>
      {file && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          選択されたファイル: {file.name}
        </Typography>
      )}
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        variant="contained"
        sx={{
          marginTop: 2,
          padding: "10px 20px",
          backgroundColor: uploading ? "#ccc" : "#1976d2",
          color: "#fff",
          "&:hover": { backgroundColor: "#1565c0" },
        }}
      >
        {uploading ? "アップロード中..." : "アップロード"}
      </Button>

      {/* アップロード結果の表示 */}
      {uploadResult && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6">アップロード結果</Typography>
          <Typography>スライド数: {uploadResult.slide_count}</Typography>

          {/* 全品詞のカウントのグラフ */}
          <Bar
            data={data}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />

          {/* トップ3の名詞、動詞、助詞をリスト表示 */}
          <Typography variant="h6" sx={{ marginTop: 4 }}>
            名詞のトップ3
          </Typography>
          <List>
            {uploadResult.top_nouns.map(([noun, count], index) => (
              <ListItem key={index}>
                {index + 1}位: {noun} ({count}回)
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ marginTop: 4 }}>
            動詞のトップ3
          </Typography>
          <List>
            {uploadResult.top_verbs.map(([verb, count], index) => (
              <ListItem key={index}>
                {index + 1}位: {verb} ({count}回)
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ marginTop: 4 }}>
            助詞のトップ3
          </Typography>
          <List>
            {uploadResult.top_particles.map(([particle, count], index) => (
              <ListItem key={index}>
                {index + 1}位: {particle} ({count}回)
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Paper>
  );
};

export default Form;
