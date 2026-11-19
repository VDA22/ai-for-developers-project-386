import Vapor

struct HealthResponse: Content {
    let status: String
}
