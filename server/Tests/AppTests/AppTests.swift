import Testing
import Vapor
import VaporTesting

@testable import App

func configureTestApp(_ app: Application) throws {
    try configure(app)
    try routes(app)
}

@Test
func healthReturnsOk() async throws {
    try await withApp(configure: configureTestApp) { app in
        try await app.testing().test(
            .GET, "/api/health",
            afterResponse: { response in
                #expect(response.status == .ok)
                let body = try response.content.decode(HealthResponse.self)
                #expect(body.status == "ok")
            })
    }
}
