"""
Anlık Dolar Kuru API v2 - SÜPER HIZLI ⚡⚡⚡
Doğrudan anlikaltinfiyatlari.com API'sine bağlanır
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import asyncio
from datetime import datetime
from typing import List
import json

from dolar_scraper_pro import DolarScraperPro

app = FastAPI(
    title="Anlık Dolar Kuru API v2",
    description="⚡ SÜPER HIZLI - Doğrudan API bağlantısı ile anlık döviz kurları",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pro Scraper
scraper = DolarScraperPro()

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                disconnected.append(connection)
        
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

# Background task - Her saniye güncelle
async def update_data_periodically():
    """Her 1 saniyede bir HIZLI veri günceller ⚡"""
    while True:
        try:
            # Sadece API'den hızlı çek (banka verileri olmadan)
            data = await scraper.fetch_quick()
            
            if manager.active_connections:
                await manager.broadcast({
                    "type": "update",
                    "data": data
                })
            
        except Exception as e:
            print(f"Güncelleme hatası: {e}")
        
        # 1 saniye bekle
        await asyncio.sleep(1)

# Her 30 saniyede bir tam veri güncelle (banka verileri dahil)
async def update_full_data_periodically():
    """Her 30 saniyede bir TAM veri günceller (banka dahil)"""
    while True:
        try:
            await asyncio.sleep(30)
            data = await scraper.fetch_all_data()
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Tam veri güncellendi (banka dahil)")
        except Exception as e:
            print(f"Tam güncelleme hatası: {e}")

@app.on_event("startup")
async def startup_event():
    print("🚀 API v2 başlatılıyor...")
    
    # İlk veriyi çek
    await scraper.fetch_all_data()
    print("✅ İlk veri çekildi")
    
    # Background task'ları başlat
    asyncio.create_task(update_data_periodically())
    asyncio.create_task(update_full_data_periodically())
    print("⚡ Anlık güncelleme başlatıldı (1 saniye)")
    print("🏦 Banka güncelleme başlatıldı (30 saniye)")

@app.get("/", response_class=HTMLResponse)
async def root():
    """Ana sayfa"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>💰 Anlık Dolar API v2</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; max-width: 1200px; margin: 50px auto; padding: 20px; background: #1a1a2e; color: #eee; }
            h1 { color: #00d4ff; }
            .card { background: #16213e; padding: 20px; margin: 15px 0; border-radius: 10px; border-left: 4px solid #00d4ff; }
            code { background: #0f3460; padding: 3px 8px; border-radius: 4px; color: #00d4ff; }
            .fast { color: #00ff88; font-weight: bold; }
            a { color: #00d4ff; }
            .endpoint { background: #0f3460; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .method { color: #00ff88; font-weight: bold; margin-right: 10px; }
        </style>
    </head>
    <body>
        <h1>💰 Anlık Dolar Kuru API v2 ⚡</h1>
        <p class="fast">🚀 SÜPER HIZLI - Doğrudan API bağlantısı ile ~250ms yanıt süresi!</p>
        
        <div class="card">
            <h2>🔌 API Endpoints</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api/quick</code>
                <p>⚡ En hızlı endpoint - Sadece döviz kurları (~250ms)</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api/dolar</code>
                <p>Tam veri - Döviz kurları + Banka kurları</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api/currencies</code>
                <p>Tüm döviz kurları (USD, EUR, GBP, XAU, XAG...)</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api/banks</code>
                <p>Banka dolar kurları (17 banka)</p>
            </div>
            
            <div class="endpoint">
                <span class="method">WS</span> <code>/ws</code>
                <p>WebSocket - Her saniye anlık güncelleme ⚡</p>
            </div>
        </div>
        
        <div class="card">
            <h2>📡 Veri Kaynağı</h2>
            <p>Doğrudan <code>anlikaltinfiyatlari.com/socket/total.php</code> API'sine bağlanır.</p>
            <p>Güncelleme: <span class="fast">Her 1 saniye</span> (WebSocket)</p>
            <p>Banka verileri: Her 30 saniye</p>
        </div>
        
        <div class="card">
            <h2>📖 Dokümantasyon</h2>
            <p><a href="/docs">Swagger UI</a> | <a href="/redoc">ReDoc</a></p>
        </div>
        
        <div class="card">
            <h2>💡 WebSocket Örneği</h2>
            <pre><code>const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log('Dolar:', data.data.currencies.USDTRY.value);
};</code></pre>
        </div>
    </body>
    </html>
    """

@app.get("/api/quick")
async def get_quick():
    """⚡ En hızlı endpoint - Sadece API verisi"""
    return await scraper.fetch_quick()

@app.get("/api/dolar")
async def get_dolar():
    """Tam dolar verisi (banka dahil)"""
    data = scraper.get_cached_data()
    if not data or 'banks' not in data:
        data = await scraper.fetch_all_data()
    return data

@app.get("/api/currencies")
async def get_currencies():
    """Tüm döviz kurları"""
    data = scraper.get_cached_data()
    if not data:
        data = await scraper.fetch_quick()
    
    return {
        "timestamp": data.get("timestamp"),
        "api_time": data.get("api_time"),
        "currencies": data.get("currencies", {})
    }

@app.get("/api/banks")
async def get_banks():
    """Banka dolar kurları"""
    data = scraper.get_cached_data()
    if not data or 'banks' not in data:
        data = await scraper.fetch_all_data()
    
    return {
        "timestamp": data.get("timestamp"),
        "banks": data.get("banks", []),
        "bank_count": len(data.get("banks", []))
    }

@app.get("/api/status")
async def get_status():
    """API durumu"""
    last_update = scraper.get_last_update_time()
    return {
        "status": "running",
        "version": "2.0.0",
        "last_update": last_update.isoformat() if last_update else None,
        "websocket_connections": len(manager.active_connections),
        "features": {
            "direct_api": True,
            "websocket": True,
            "update_interval": "1 second",
            "bank_update_interval": "30 seconds"
        }
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket - Anlık veri güncellemeleri"""
    await manager.connect(websocket)
    print(f"🔌 Yeni WebSocket bağlantısı. Toplam: {len(manager.active_connections)}")
    
    try:
        # İlk veriyi gönder
        cached = scraper.get_cached_data()
        if cached:
            await websocket.send_json({"type": "initial", "data": cached})
        
        # Bağlantıyı açık tut
        while True:
            try:
                message = await asyncio.wait_for(websocket.receive_text(), timeout=30)
                await websocket.send_json({"type": "pong", "message": message})
            except asyncio.TimeoutError:
                await websocket.send_json({"type": "ping"})
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"🔌 Bağlantı kesildi. Kalan: {len(manager.active_connections)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
