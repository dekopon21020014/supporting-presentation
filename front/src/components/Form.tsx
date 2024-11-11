'use client';

import React, { useState, ChangeEvent, useRef } from 'react';
import { Button, Typography, Paper } from '@mui/material';

const Form = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択時の処理
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // ファイル送信処理
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    // ファイル送信ロジック（例としてFormDataを使用）
    const formData = new FormData();
    formData.append("file", file);

    try {
      // ファイルをサーバーに送信
      await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: '600px', margin: 'auto', padding: 4, marginTop: 8 }}>
      <input
        type="file"
        accept=".pptx"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        id="pptx-upload"
      />
      <label htmlFor="pptx-upload">
        <Button variant="outlined" component="span" sx={{ padding: '10px 20px', borderColor: '#1976d2', color: '#1976d2' }}>
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
          padding: '10px 20px',
          backgroundColor: uploading ? '#ccc' : '#1976d2',
          color: '#fff',
          '&:hover': { backgroundColor: '#1565c0' },
        }}
      >
        {uploading ? 'アップロード中...' : 'アップロード'}
      </Button>
    </Paper>
  );
};

export default Form;
