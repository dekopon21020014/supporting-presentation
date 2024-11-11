import os
from fastapi import APIRouter, File, UploadFile, status
from fastapi.responses import ORJSONResponse
from pptx import Presentation
from io import BytesIO

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

    # バイトストリームからpptxファイルを読み込む
    presentation = Presentation(BytesIO(file_content))

    # プレゼンテーションのスライド数を取得して、1ページ目のタイトルを表示する例
    slide_count = len(presentation.slides)
    slide_titles = []

    # スライドの内容を取得（例: タイトルの取得）
    for slide in presentation.slides:
        title = None
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                if shape.text.strip() != "":
                    title = shape.text.strip()
                    break
        slide_titles.append(title)

    # 結果を返す
    return {
        "message": "File processed successfully",
        "slide_count": slide_count,
        "slide_titles": slide_titles
    }
