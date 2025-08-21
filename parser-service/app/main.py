from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.post("/api/v1/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    # TODO: call Document AI / OpenAI here
    return {"ok": True, "data": {"basic": {"name": "山田太郎"}, "educations": [], "careers": []}}
