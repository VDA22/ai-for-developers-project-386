import Vapor

func routes(_ app: Application) throws {
    app.get("api", "health") { _ in
        HealthResponse(status: "ok")
    }
}
