import os
from fastapi import APIRouter, File, UploadFile, status
from fastapi.responses import ORJSONResponse
from pptx import Presentation
from io import BytesIO
import MeCab
from collections import Counter

router = APIRouter(tags=["Demo"], default_response_class=ORJSONResponse)


@router.get(
    path="/",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {
            "description": "200 OK",
            "content": {
                "application/json": {
                    "example": {"message": "yahoo.co.jp"}
                }
            }
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error dayo"
        },
    },
)
async def get_demo():
    return {"message": "hello"}


@router.post(
    path="/upload",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {
            "description": "200 OK",
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error"
        },
    },
)

async def upload_pptx(file: UploadFile = File(...)):
    # ファイルの読み込み
    file_content = await file.read()

    # プレゼンテーションを読み込み
    presentation = Presentation(BytesIO(file_content))
    all_text = " ".join(
        shape.text.strip()
        for slide in presentation.slides
        for shape in slide.shapes
        if hasattr(shape, "text") and shape.text.strip()
    )

    # 形態素解析と品詞カウント
    mecab = MeCab.Tagger()
    parsed_text = mecab.parse(all_text)

    pos_counts = Counter()  # 品詞のカウント
    noun_counts = Counter()  # 名詞の頻度カウント
    verb_counts = Counter()  # 動詞の頻度カウント
    particle_counts = Counter()  # 助詞の頻度カウント

    for line in parsed_text.splitlines():
        if "\t" in line:
            surface, feature = line.split("\t")
            pos = feature.split(",")[0]  # 品詞（名詞、動詞など）を取得

            pos_counts[pos] += 1

            if pos == "名詞":
                noun_counts[surface] += 1
            elif pos == "動詞":
                verb_counts[surface] += 1
            elif pos == "助詞":
                particle_counts[surface] += 1

    # 上位3位の名詞、動詞、助詞を取得
    top_nouns = noun_counts.most_common(3)
    top_verbs = verb_counts.most_common(3)
    top_particles = particle_counts.most_common(3)

    # 結果を返す
    return {
        "message": "File processed successfully",
        "slide_count": len(presentation.slides),
        "pos_counts": pos_counts,  # 全品詞のカウント
        "top_nouns": top_nouns,  # 名詞のトップ3
        "top_verbs": top_verbs,  # 動詞のトップ3
        "top_particles": top_particles,  # 助詞のトップ3
    }
