from fastapi import FastAPI

app = FastAPI(title="Anlık Dolar API v2")

@app.get("/")
async def root():
    return {"message": "API çalışıyor!"}